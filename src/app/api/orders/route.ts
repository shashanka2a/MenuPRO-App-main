import { NextRequest, NextResponse } from 'next/server';
import { getPrismaFromRequest } from '@/lib/prisma-tenant';
import { withAuth } from '@/lib/supabase-auth';
import { setupAuditLogging } from '@/lib/audit-middleware';

export interface GetOrdersResponse {
  success: boolean;
  orders?: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    total: number;
    customerName?: string;
    estimatedTime?: number;
    placedAt: string;
    table?: {
      id: string;
      number: string;
      name?: string;
    };
    items: {
      id: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      menuItem: {
        id: string;
        name: string;
        price: number;
      };
    }[];
  }[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<GetOrdersResponse>> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // Pagination parameters
      const page = parseInt(searchParams.get('page') || '1');
      const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
      const skip = (page - 1) * limit;
      
      // Filter parameters
      const status = searchParams.get('status');
      const tableId = searchParams.get('tableId');
      const fromDate = searchParams.get('fromDate');
      const toDate = searchParams.get('toDate');
      const customerPhone = searchParams.get('customerPhone');

      const prisma = getPrismaFromRequest(request);
      setupAuditLogging(prisma, request, tenantContext);

      // Build where clause
      const where: any = {
        restaurantId: tenantContext.restaurantId
      };

      // For customers, only show their own orders
      if (user.memberships.some(m => m.role === 'CUSTOMER')) {
        where.userId = user.id;
      }

      if (status) {
        where.status = status;
      }

      if (tableId) {
        where.tableId = tableId;
      }

      if (customerPhone) {
        where.customerPhone = { contains: customerPhone };
      }

      if (fromDate || toDate) {
        where.placedAt = {};
        if (fromDate) {
          where.placedAt.gte = new Date(fromDate);
        }
        if (toDate) {
          where.placedAt.lte = new Date(toDate);
        }
      }

      // Get orders with pagination
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            table: {
              select: {
                id: true,
                number: true,
                name: true
              }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: {
                    id: true,
                    name: true,
                    price: true
                  }
                }
              }
            }
          },
          orderBy: { placedAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.order.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        orders: orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          total: parseFloat(order.total.toString()),
          customerName: order.customerName || undefined,
          estimatedTime: order.estimatedTime || undefined,
          placedAt: order.placedAt.toISOString(),
          table: order.table || undefined,
          items: order.orderItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice.toString()),
            totalPrice: parseFloat(item.totalPrice.toString()),
            menuItem: {
              id: item.menuItem.id,
              name: item.menuItem.name,
              price: parseFloat(item.menuItem.price.toString())
            }
          }))
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });

    } catch (error: any) {
      console.error('Get orders error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to retrieve orders'
      }, { status: 500 });
    }
  });
}