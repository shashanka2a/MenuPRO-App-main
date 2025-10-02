import * as Sentry from '@sentry/nextjs';
import winston from 'winston';
import { TenantPrismaClient } from './prisma-tenant';

// Metrics collection interface
export interface MetricsData {
  ordersPerMinute: number;
  failedOTPs: number;
  menuParseLatency: number;
  activeUsers: number;
  errorRate: number;
  responseTime: number;
  databaseConnections: number;
}

// Performance monitoring data
export interface PerformanceMetrics {
  operation: string;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'menupro-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export class MonitoringService {
  private prisma: TenantPrismaClient;
  private metricsCache: Map<string, any> = new Map();
  private performanceMetrics: PerformanceMetrics[] = [];

  constructor(prisma: TenantPrismaClient) {
    this.prisma = prisma;
    this.setupSentry();
    this.setupPrismaMonitoring();
  }

  // Setup Sentry for error tracking
  private setupSentry() {
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
        beforeSend(event) {
          // Filter out sensitive data
          if (event.exception) {
            const exception = event.exception.values?.[0];
            if (exception?.stacktrace?.frames) {
              exception.stacktrace.frames = exception.stacktrace.frames.map(frame => ({
                ...frame,
                vars: undefined // Remove variable data
              }));
            }
          }
          return event;
        }
      });
    }
  }

  // Setup Prisma query monitoring
  private setupPrismaMonitoring() {
    this.prisma.$use(async (params, next) => {
      const start = Date.now();
      
      try {
        const result = await next(params);
        const duration = Date.now() - start;
        
        // Log slow queries
        if (duration > 1000) { // Queries taking more than 1 second
          logger.warn('Slow query detected', {
            model: params.model,
            action: params.action,
            duration,
            args: params.args
          });
        }
        
        // Track performance metrics
        this.trackPerformance({
          operation: `prisma.${params.model}.${params.action}`,
          duration,
          success: true,
          metadata: {
            model: params.model,
            action: params.action
          }
        });
        
        return result;
      } catch (error: any) {
        const duration = Date.now() - start;
        
        // Log database errors
        logger.error('Database query error', {
          model: params.model,
          action: params.action,
          duration,
          error: error.message,
          args: params.args
        });
        
        // Track failed operations
        this.trackPerformance({
          operation: `prisma.${params.model}.${params.action}`,
          duration,
          success: false,
          error: error.message,
          metadata: {
            model: params.model,
            action: params.action
          }
        });
        
        // Send to Sentry
        Sentry.captureException(error, {
          tags: {
            operation: 'database',
            model: params.model,
            action: params.action
          },
          extra: {
            duration,
            args: params.args
          }
        });
        
        throw error;
      }
    });
  }

  // Track performance metrics
  trackPerformance(metrics: PerformanceMetrics) {
    this.performanceMetrics.push({
      ...metrics,
      timestamp: Date.now()
    } as any);

    // Keep only last 1000 metrics in memory
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    // Log performance data
    logger.info('Performance metric', metrics);
  }

  // Capture application errors
  captureError(error: Error, context?: Record<string, any>) {
    logger.error('Application error', {
      message: error.message,
      stack: error.stack,
      context
    });

    Sentry.captureException(error, {
      extra: context
    });
  }

  // Track custom events
  trackEvent(event: string, data?: Record<string, any>) {
    logger.info('Custom event', {
      event,
      data,
      timestamp: new Date().toISOString()
    });

    // Could also send to analytics service
  }

  // Get current metrics
  async getMetrics(): Promise<MetricsData> {
    try {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const oneHourAgo = new Date(now.getTime() - 3600000);

      // Orders per minute
      const recentOrders = await this.prisma.order.count({
        where: {
          createdAt: {
            gte: oneMinuteAgo
          }
        }
      });

      // Failed OTPs (from audit logs)
      const failedOTPs = await this.prisma.auditLog.count({
        where: {
          action: 'LOGIN',
          createdAt: {
            gte: oneHourAgo
          },
          metadata: {
            path: ['event'],
            equals: 'otp_failed'
          }
        }
      });

      // Calculate performance metrics from in-memory data
      const recentMetrics = this.performanceMetrics.filter(
        m => (m as any).timestamp > oneMinuteAgo.getTime()
      );

      const menuParseMetrics = recentMetrics.filter(
        m => m.operation.includes('menu-parser')
      );

      const menuParseLatency = menuParseMetrics.length > 0
        ? menuParseMetrics.reduce((sum, m) => sum + m.duration, 0) / menuParseMetrics.length
        : 0;

      const errorRate = recentMetrics.length > 0
        ? (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100
        : 0;

      const avgResponseTime = recentMetrics.length > 0
        ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
        : 0;

      return {
        ordersPerMinute: recentOrders,
        failedOTPs,
        menuParseLatency: Math.round(menuParseLatency),
        activeUsers: await this.getActiveUsersCount(),
        errorRate: Math.round(errorRate * 100) / 100,
        responseTime: Math.round(avgResponseTime),
        databaseConnections: this.getDatabaseConnectionCount()
      };

    } catch (error: any) {
      logger.error('Error getting metrics', { error: error.message });
      throw error;
    }
  }

  // Get active users count
  private async getActiveUsersCount(): Promise<number> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      
      const activeUsers = await this.prisma.user.count({
        where: {
          lastLogin: {
            gte: fifteenMinutesAgo
          }
        }
      });

      return activeUsers;
    } catch (error) {
      return 0;
    }
  }

  // Get database connection count (placeholder)
  private getDatabaseConnectionCount(): number {
    // This would depend on your specific database setup
    // For Prisma, you might check the connection pool
    return 10; // Placeholder
  }

  // Health check endpoint data
  async getHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: {
      database: boolean;
      storage: boolean;
      auth: boolean;
    };
    metrics: MetricsData;
    timestamp: string;
  }> {
    const checks = {
      database: await this.checkDatabase(),
      storage: await this.checkStorage(),
      auth: await this.checkAuth()
    };

    const allHealthy = Object.values(checks).every(check => check);
    const status = allHealthy ? 'healthy' : 'degraded';

    const metrics = await this.getMetrics();

    return {
      status,
      checks,
      metrics,
      timestamp: new Date().toISOString()
    };
  }

  // Database health check
  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed', { error });
      return false;
    }
  }

  // Storage health check
  private async checkStorage(): Promise<boolean> {
    try {
      // This would check Supabase storage connectivity
      return true; // Placeholder
    } catch (error) {
      logger.error('Storage health check failed', { error });
      return false;
    }
  }

  // Auth service health check
  private async checkAuth(): Promise<boolean> {
    try {
      // This would check Supabase auth service
      return true; // Placeholder
    } catch (error) {
      logger.error('Auth health check failed', { error });
      return false;
    }
  }

  // Alert thresholds
  checkAlerts(metrics: MetricsData): string[] {
    const alerts: string[] = [];

    if (metrics.errorRate > 5) {
      alerts.push(`High error rate: ${metrics.errorRate}%`);
    }

    if (metrics.responseTime > 2000) {
      alerts.push(`High response time: ${metrics.responseTime}ms`);
    }

    if (metrics.failedOTPs > 10) {
      alerts.push(`High failed OTP count: ${metrics.failedOTPs}`);
    }

    if (metrics.menuParseLatency > 30000) {
      alerts.push(`High menu parse latency: ${metrics.menuParseLatency}ms`);
    }

    return alerts;
  }

  // Cleanup old metrics
  cleanup() {
    const oneHourAgo = Date.now() - 3600000;
    this.performanceMetrics = this.performanceMetrics.filter(
      m => (m as any).timestamp > oneHourAgo
    );
  }
}

// Singleton instance
let monitoringService: MonitoringService;

export function createMonitoringService(prisma: TenantPrismaClient): MonitoringService {
  if (!monitoringService) {
    monitoringService = new MonitoringService(prisma);
    
    // Setup cleanup interval
    setInterval(() => {
      monitoringService.cleanup();
    }, 300000); // Every 5 minutes
  }
  return monitoringService;
}

export function getMonitoringService(): MonitoringService {
  if (!monitoringService) {
    throw new Error('Monitoring service not initialized');
  }
  return monitoringService;
}

// Express middleware for request tracking
export function trackRequest() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const success = res.statusCode < 400;
      
      if (monitoringService) {
        monitoringService.trackPerformance({
          operation: `${req.method} ${req.path}`,
          duration,
          success,
          metadata: {
            statusCode: res.statusCode,
            method: req.method,
            path: req.path,
            userAgent: req.get('User-Agent')
          }
        });
      }
      
      logger.info('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip: req.ip
      });
    });
    
    next();
  };
}

export { logger };
export default MonitoringService;