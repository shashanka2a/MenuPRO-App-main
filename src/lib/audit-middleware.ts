import { Prisma } from '@prisma/client';
import { TenantPrismaClient } from './prisma-tenant';

export interface AuditContext {
  userId?: string;
  restaurantId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// Types for audit actions
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT';

// Models that should be audited
const AUDITED_MODELS = [
  'User',
  'Restaurant', 
  'Membership',
  'Table',
  'MenuVersion',
  'MenuItem',
  'Order',
  'OrderItem'
];

// Sensitive fields that should be masked in audit logs
const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'token',
  'refreshToken',
  'secret',
  'apiKey',
  'privateKey'
];

export class AuditLogger {
  private prisma: TenantPrismaClient;
  private context: AuditContext;

  constructor(prisma: TenantPrismaClient, context: AuditContext = {}) {
    this.prisma = prisma;
    this.context = context;
  }

  // Setup audit middleware on Prisma client
  static setupAuditMiddleware(prisma: TenantPrismaClient, context: AuditContext = {}) {
    const auditLogger = new AuditLogger(prisma, context);

    prisma.$use(async (params, next) => {
      const { model, action, args } = params;

      // Skip non-audited models
      if (!model || !AUDITED_MODELS.includes(model)) {
        return next(params);
      }

      // Skip audit logs table to prevent infinite recursion
      if (model === 'AuditLog') {
        return next(params);
      }

      let beforeState: any = null;
      let recordId: string | null = null;

      // For updates and deletes, capture the before state
      if (['update', 'updateMany', 'delete', 'deleteMany', 'upsert'].includes(action)) {
        try {
          if (action === 'update' || action === 'delete' || action === 'upsert') {
            // Get the record before modification
            const beforeResult = await auditLogger.getRecordById(model, args.where);
            if (beforeResult) {
              beforeState = auditLogger.sanitizeData(beforeResult);
              recordId = beforeResult.id;
            }
          } else if (action === 'updateMany' || action === 'deleteMany') {
            // For bulk operations, get all affected records
            const beforeResults = await auditLogger.getRecordsByWhere(model, args.where);
            beforeState = beforeResults.map((record: any) => 
              auditLogger.sanitizeData(record)
            );
          }
        } catch (error) {
          console.error('Error capturing before state for audit:', error);
        }
      }

      // Execute the original operation
      const result = await next(params);

      // Capture after state and log the audit entry
      try {
        await auditLogger.logAuditEntry({
          action: auditLogger.mapActionToAuditAction(action),
          tableName: model,
          recordId,
          beforeState,
          afterState: auditLogger.getAfterState(action, args, result),
          args
        });
      } catch (error) {
        console.error('Error logging audit entry:', error);
        // Don't fail the original operation due to audit logging errors
      }

      return result;
    });
  }

  // Update audit context (e.g., when user context changes)
  updateContext(context: Partial<AuditContext>) {
    this.context = { ...this.context, ...context };
  }

  // Manual audit logging for custom events
  async logCustomEvent(
    action: AuditAction,
    tableName: string,
    recordId?: string,
    beforeState?: any,
    afterState?: any,
    metadata?: Record<string, any>
  ) {
    await this.logAuditEntry({
      action,
      tableName,
      recordId,
      beforeState,
      afterState,
      metadata
    });
  }

  private async logAuditEntry({
    action,
    tableName,
    recordId,
    beforeState,
    afterState,
    args,
    metadata
  }: {
    action: AuditAction;
    tableName: string;
    recordId?: string | null;
    beforeState?: any;
    afterState?: any;
    args?: any;
    metadata?: Record<string, any>;
  }) {
    try {
      // Extract orderId if dealing with order-related operations
      const orderId = this.extractOrderId(tableName, beforeState, afterState, args);

      await this.prisma.auditLog.create({
        data: {
          userId: this.context.userId,
          restaurantId: this.context.restaurantId,
          orderId,
          action,
          tableName,
          recordId,
          beforeState: beforeState ? this.sanitizeData(beforeState) : null,
          afterState: afterState ? this.sanitizeData(afterState) : null,
          ipAddress: this.context.ipAddress,
          userAgent: this.context.userAgent,
          metadata: {
            ...metadata,
            ...this.context.metadata,
            originalArgs: args ? this.sanitizeData(args) : undefined
          }
        }
      });
    } catch (error) {
      console.error('Failed to create audit log entry:', error);
    }
  }

  private async getRecordById(model: string, where: any): Promise<any> {
    try {
      // @ts-ignore - Dynamic model access
      return await this.prisma[model.toLowerCase()].findFirst({ where });
    } catch (error) {
      console.error(`Error fetching record for audit (${model}):`, error);
      return null;
    }
  }

  private async getRecordsByWhere(model: string, where: any): Promise<any[]> {
    try {
      // @ts-ignore - Dynamic model access
      return await this.prisma[model.toLowerCase()].findMany({ where });
    } catch (error) {
      console.error(`Error fetching records for audit (${model}):`, error);
      return [];
    }
  }

  private getAfterState(action: string, args: any, result: any): any {
    if (['create', 'update', 'upsert'].includes(action)) {
      return this.sanitizeData(result);
    }
    
    if (action === 'createMany') {
      return result?.count ? { recordsCreated: result.count } : null;
    }
    
    if (['updateMany', 'deleteMany'].includes(action)) {
      return result?.count ? { recordsAffected: result.count } : null;
    }
    
    return null;
  }

  private mapActionToAuditAction(prismaAction: string): AuditAction {
    const actionMap: Record<string, AuditAction> = {
      'create': 'CREATE',
      'createMany': 'CREATE',
      'update': 'UPDATE',
      'updateMany': 'UPDATE',
      'upsert': 'UPDATE',
      'delete': 'DELETE',
      'deleteMany': 'DELETE'
    };

    return actionMap[prismaAction] || 'UPDATE';
  }

  private extractOrderId(
    tableName: string, 
    beforeState?: any, 
    afterState?: any, 
    args?: any
  ): string | undefined {
    // Extract orderId for order-related operations
    if (tableName === 'Order') {
      return beforeState?.id || afterState?.id || args?.where?.id;
    }
    
    if (tableName === 'OrderItem') {
      return beforeState?.orderId || afterState?.orderId || args?.data?.orderId;
    }
    
    return undefined;
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Helper function to create audit context from request
export function createAuditContext(
  req: Request,
  tenantContext: { userId?: string; restaurantId?: string }
): AuditContext {
  return {
    userId: tenantContext.userId,
    restaurantId: tenantContext.restaurantId,
    ipAddress: getClientIP(req),
    userAgent: req.headers.get('user-agent') || undefined,
    metadata: {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    }
  };
}

// Helper function to extract client IP
function getClientIP(req: Request): string | undefined {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return undefined;
}

// Helper function to setup audit logging for a Prisma client with request context
export function setupAuditLogging(
  prisma: TenantPrismaClient,
  req: Request,
  tenantContext: { userId?: string; restaurantId?: string }
) {
  const auditContext = createAuditContext(req, tenantContext);
  AuditLogger.setupAuditMiddleware(prisma, auditContext);
  return new AuditLogger(prisma, auditContext);
}

export default AuditLogger;