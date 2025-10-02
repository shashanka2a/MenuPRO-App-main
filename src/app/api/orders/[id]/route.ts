import { NextRequest, NextResponse } from 'next/server';
import { getPrismaFromRequest } from '@/lib/prisma-tenant';
import { withAuth } from '@/lib/supabase-auth';
import { setupAuditLogging } from '@/lib/audit-middleware';

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  version: number; // For optimistic concurrency control
  estimatedTime?: number;
  notes?: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    version: number;
    updatedAt: string;
  };
  error?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<UpdateOrderStatusResponse>> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      const orderId = params.id;
      const body: UpdateOrderStatusRequest = await request.json();
      
      // Validate status transition
      if (!isValidStatusTransition(body.status)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid order status'
        }, { status: 400 });
      }

      const prisma = getPrismaFromRequest(request);
      setupAuditLogging(prisma, request, tenantContext);

      // Check user permissions
      const hasStaffPermission = user.memberships.some(m => 
        m.restaurantId === tenantContext.restaurantId && 
        ['STAFF', 'MANAGER', 'ADMIN', 'OWNER'].includes(m.role)
      );

      if (!hasStaffPermission) {
        return NextResponse.json({
          success: false,
          error: 'Insufficient permissions to update order status'
        }, { status: 403 });
      }

      // Use optimistic concurrency control
      const updatedOrder = await prisma.$transaction(async (tx: any) => {
        // Get current order with version check
        const currentOrder = await tx.order.findUnique({
          where: { 
            id: orderId,
            restaurantId: tenantContext.restaurantId
          }
        });

        if (!currentOrder) {
          throw new Error('Order not found');
        }

        // Check version for optimistic concurrency
        if (currentOrder.version !== body.version) {
          throw new Error('Order has been modified by another user. Please refresh and try again.');
        }

        // Validate status transition
        if (!isValidStatusTransition(currentOrder.status, body.status)) {
          throw new Error(`Cannot transition from ${currentOrder.status} to ${body.status}`);
        }

        // Update order
        const updateData: any = {
          status: body.status,
          version: currentOrder.version + 1,
          updatedAt: new Date()
        };

        // Set timestamp fields based on status
        switch (body.status) {
          case 'CONFIRMED':
            updateData.confirmedAt = new Date();
            break;
          case 'DELIVERED':
          case 'CANCELLED':
            updateData.completedAt = new Date();
            break;
        }

        // Update estimated time if provided
        if (body.estimatedTime !== undefined) {
          updateData.estimatedTime = body.estimatedTime;
        }

        const order = await tx.order.update({
          where: { id: orderId },
          data: updateData
        });

        return order;
      });

      return NextResponse.json({
        success: true,
        order: {
          id: updatedOrder.id,
          orderNumber: updatedOrder.orderNumber,
          status: updatedOrder.status,
          version: updatedOrder.version,
          updatedAt: updatedOrder.updatedAt.toISOString()
        }
      });

    } catch (error: any) {
      console.error('Update order status error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to update order status'
      }, { status: 500 });
    }
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      const orderId = params.id;
      
      const prisma = getPrismaFromRequest(request);
      setupAuditLogging(prisma, request, tenantContext);

      const where: any = {
        id: orderId,
        restaurantId: tenantContext.restaurantId
      };

      // For customers, only allow access to their own orders
      if (user.memberships.some(m => m.role === 'CUSTOMER')) {
        where.userId = user.id;
      }

      const order = await prisma.order.findFirst({
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
                  description: true,
                  price: true,
                  image: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      if (!order) {
        return NextResponse.json({
          success: false,
          error: 'Order not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          version: order.version,
          subtotal: parseFloat(order.subtotal.toString()),
          tax: parseFloat(order.tax.toString()),
          tip: parseFloat(order.tip.toString()),
          total: parseFloat(order.total.toString()),
          currency: order.currency,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          specialRequests: order.specialRequests,
          estimatedTime: order.estimatedTime,
          placedAt: order.placedAt.toISOString(),
          confirmedAt: order.confirmedAt?.toISOString(),
          completedAt: order.completedAt?.toISOString(),
          table: order.table,
          user: order.user,
          items: order.orderItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice.toString()),
            totalPrice: parseFloat(item.totalPrice.toString()),
            specialRequests: item.specialRequests,
            menuItem: {
              id: item.menuItem.id,
              name: item.menuItem.name,
              description: item.menuItem.description,
              price: parseFloat(item.menuItem.price.toString()),
              image: item.menuItem.image
            }
          }))
        }
      });

    } catch (error: any) {
      console.error('Get order error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to retrieve order'
      }, { status: 500 });
    }
  });
}

function isValidStatusTransition(from?: string, to?: string): boolean {
  if (!to) return false;
  
  const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(to)) return false;
  
  if (!from) return to === 'PENDING'; // Initial status
  
  const transitions: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [], // Final state
    CANCELLED: [] // Final state
  };
  
  return transitions[from]?.includes(to) || false;
}