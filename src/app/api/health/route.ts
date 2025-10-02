import { NextRequest, NextResponse } from 'next/server';
import { createTenantPrisma } from '@/lib/prisma-tenant';
import { createMonitoringService } from '@/lib/monitoring';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const prisma = createTenantPrisma({});
    const monitoring = createMonitoringService(prisma);
    
    const healthCheck = await monitoring.getHealthCheck();
    const alerts = monitoring.checkAlerts(healthCheck.metrics);
    
    const response = {
      ...healthCheck,
      alerts,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(response, { status: statusCode });
    
  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}