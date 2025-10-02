import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface User {
  email: string;
  verified: boolean;
  memberships?: Array<{ role: string; permissions: string[] }>;
}

interface TenantContext {
  tenantId: string;
  domain: string;
}

// Authentication wrapper function
async function withAuth(
  req: NextRequest,
  handler: (request: NextRequest, user: User, tenantContext: TenantContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: User;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as User;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Mock tenant context - in a real app, this would be derived from the request
    const tenantContext: TenantContext = {
      tenantId: 'default',
      domain: req.headers.get('host') || 'localhost'
    };

    // Call the handler with authenticated user and tenant context
    return await handler(req, decoded, tenantContext);

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      // Check if user has admin permissions
      const hasAdminPermission = user.memberships?.some(m => 
        m.role === 'admin' || m.permissions.includes('view_metrics')
      ) || false;

      if (!hasAdminPermission) {
        return NextResponse.json(
          { message: 'Insufficient permissions to view metrics' },
          { status: 403 }
        );
      }

      // Mock metrics data - in a real app, this would come from a monitoring service
      const metrics = {
        timestamp: new Date().toISOString(),
        tenantId: tenantContext.tenantId,
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version
        },
        api: {
          totalRequests: 1000,
          successRate: 98.5,
          avgResponseTime: 250,
          errorRate: 1.5
        },
        orders: {
          totalOrders: 500,
          pendingOrders: 25,
          completedOrders: 475,
          avgOrderValue: 35.50
        },
        users: {
          totalUsers: 100,
          activeUsers: 75,
          newUsersToday: 5
        }
      };

      return NextResponse.json(
        { 
          message: 'Metrics retrieved successfully',
          data: metrics
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Metrics retrieval error:', error);
      return NextResponse.json(
        { message: 'Failed to retrieve metrics' },
        { status: 500 }
      );
    }
  });
}