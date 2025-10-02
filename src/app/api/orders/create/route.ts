import { NextRequest, NextResponse } from 'next/server';
import { getPrismaFromRequest, createTenantPrisma } from '@/lib/prisma-tenant';
import { withAuth } from '@/lib/supabase-auth';
import { IdempotencyManager, createIdempotencyContext } from '@/lib/idempotency-middleware';
import { setupAuditLogging } from '@/lib/audit-middleware';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreateOrderRequest {
  tableId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  specialRequests?: string;
  items: {
    menuItemId: string;
    quantity: number;
    specialRequests?: string;
  }[];
  requestId?: string; // For idempotency
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    estimatedTime?: number;
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      menuItem: {
        id: string;
        name: string;
        description?: string;
        price: number;
      };
    }[];
  };
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<CreateOrderResponse>> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      const body: CreateOrderRequest = await request.json();
      
      // Validate request
      if (!body.items || body.items.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Order must contain at least one item'
        }, { status: 400 });
      }

      // Create idempotency context
      const idempotencyContext = createIdempotencyContext(request, tenantContext);
      
      // Use provided requestId or generate one
      if (body.requestId) {
        idempotencyContext.requestId = body.requestId;
      }

      // Get Prisma client with tenant context
      const prisma = getPrismaFromRequest(request);
      
      // Setup audit logging
      setupAuditLogging(prisma, request, tenantContext);
      
      // Setup idempotency
      const idempotencyManager = new IdempotencyManager(prisma);
      
      // Execute order creation with idempotency
      const result = await idempotencyManager.executeIdempotent(
        idempotencyContext,
        async () => {
          return await createOrderTransaction(prisma, body, user.id, tenantContext.restaurantId!);
        }
      );

      return NextResponse.json({
        success: true,
        order: result.data
      });

    } catch (error: any) {
      console.error('Order creation error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to create order'
      }, { status: 500 });
    }
  });
}

async function createOrderTransaction(
  prisma: any,
  orderData: CreateOrderRequest,
  userId: string,
  restaurantId: string
) {
  return await prisma.$transaction(async (tx: any) => {
    // 1. Validate menu items and get current prices
    const menuItemIds = orderData.items.map(item => item.menuItemId);
    const menuItems = await tx.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId,
        status: 'AVAILABLE'
      },
      include: {
        menuVersion: {
          where: {
            isActive: true,
            isPublished: true
          }
        }
      }
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new Error('Some menu items are not available or not found');
    }

    // Validate that all items belong to an active menu version
    const invalidItems = menuItems.filter(item => !item.menuVersion || item.menuVersion.length === 0);
    if (invalidItems.length > 0) {
      throw new Error('Some menu items are not from an active menu version');
    }

    // 2. Validate table if provided
    let table = null;
    if (orderData.tableId) {
      table = await tx.table.findFirst({
        where: {
          id: orderData.tableId,
          restaurantId,
          isActive: true
        }
      });
      
      if (!table) {
        throw new Error('Table not found or not available');
      }
    }

    // 3. Calculate totals
    let subtotal = new Decimal(0);
    const orderItemsData = [];

    for (const item of orderData.items) {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId)!;
      const unitPrice = new Decimal(menuItem.price);
      const totalPrice = unitPrice.mul(item.quantity);
      
      subtotal = subtotal.add(totalPrice);
      
      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        specialRequests: item.specialRequests
      });
    }

    // Calculate tax (assuming 10% tax rate, should be configurable)
    const taxRate = new Decimal(0.10);
    const tax = subtotal.mul(taxRate);
    const total = subtotal.add(tax);

    // 4. Generate order number
    const orderNumber = await generateOrderNumber(tx, restaurantId);

    // 5. Calculate estimated preparation time
    const estimatedTime = calculateEstimatedTime(orderItemsData, menuItems);

    // 6. Create the order
    const order = await tx.order.create({
      data: {
        restaurantId,
        userId: userId,
        tableId: orderData.tableId,
        orderNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal,
        tax,
        total,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        specialRequests: orderData.specialRequests,
        estimatedTime,
        requestId: orderData.requestId,
        version: 1
      }
    });

    // 7. Create order items
    const orderItems = await Promise.all(
      orderItemsData.map(itemData =>
        tx.orderItem.create({
          data: {
            orderId: order.id,
            ...itemData
          }
        })
      )
    );

    // 8. Return order with items
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: parseFloat(order.total.toString()),
      estimatedTime: order.estimatedTime,
      items: orderItems.map((orderItem: any, index: number) => {
        const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId)!;
        return {
          id: orderItem.id,
          quantity: orderItem.quantity,
          unitPrice: parseFloat(orderItem.unitPrice.toString()),
          totalPrice: parseFloat(orderItem.totalPrice.toString()),
          menuItem: {
            id: menuItem.id,
            name: menuItem.name,
            description: menuItem.description,
            price: parseFloat(menuItem.price.toString())
          }
        };
      })
    };
  });
}

async function generateOrderNumber(tx: any, restaurantId: string): Promise<string> {
  // Get today's date
  const today = new Date();
  const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Get count of orders for today
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  
  const todayOrderCount = await tx.order.count({
    where: {
      restaurantId,
      createdAt: {
        gte: startOfDay,
        lt: endOfDay
      }
    }
  });

  const orderSequence = (todayOrderCount + 1).toString().padStart(3, '0');
  return `ORD-${datePrefix}-${orderSequence}`;
}

function calculateEstimatedTime(
  orderItems: any[],
  menuItems: any[]
): number {
  let maxPrepTime = 0;
  let totalComplexity = 0;

  for (const orderItem of orderItems) {
    const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId);
    if (menuItem && menuItem.preparationTime) {
      maxPrepTime = Math.max(maxPrepTime, menuItem.preparationTime);
      totalComplexity += menuItem.preparationTime * orderItem.quantity;
    }
  }

  // Base time is the longest preparation time
  // Add complexity factor based on total quantity and prep times
  const complexityFactor = Math.ceil(totalComplexity / 10);
  
  // Minimum 5 minutes, maximum 60 minutes
  return Math.min(Math.max(maxPrepTime + complexityFactor, 5), 60);
}