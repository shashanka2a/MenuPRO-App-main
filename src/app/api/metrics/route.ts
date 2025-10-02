import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/supabase-auth';
import { createTenantPrisma } from '@/lib/prisma-tenant';
import { createMonitoringService } from '@/lib/monitoring';

export async function GET(req: NextRequest): Promise<NextResponse> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      // Check if user has admin permissions
      const hasAdminPermission = user.memberships.some(m => 
        ['ADMIN', 'OWNER'].includes(m.role)
      );

      if (!hasAdminPermission) {
        return NextResponse.json({
          success: false,
          error: 'Insufficient permissions to view metrics'
        }, { status: 403 });
      }

      const prisma = createTenantPrisma(tenantContext);
      const monitoring = createMonitoringService(prisma);
      
      const metrics = await monitoring.getMetrics();
      const alerts = monitoring.checkAlerts(metrics);
      
      return NextResponse.json({
        success: true,
        metrics,
        alerts,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Metrics error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to retrieve metrics'
      }, { status: 500 });
    }
  });
}