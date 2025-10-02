import { TenantPrismaClient } from './prisma-tenant';
import { createHash } from 'crypto';

export interface IdempotencyConfig {
  keyTtlSeconds?: number; // TTL for idempotency keys (default: 24 hours)
  maxRetries?: number;    // Max retries for concurrent requests (default: 3)
  retryDelayMs?: number;  // Delay between retries (default: 100ms)
}

export interface IdempotencyResult<T = any> {
  data: T;
  isFromCache: boolean;
  requestId: string;
}

export interface IdempotencyContext {
  userId?: string;
  restaurantId?: string;
  requestId: string;
  endpoint: string;
  method: string;
}

// Models that support idempotency
const IDEMPOTENT_MODELS = ['Order', 'Payment'];

// Operations that should be idempotent
const IDEMPOTENT_OPERATIONS = ['create', 'update'];

export class IdempotencyManager {
  private prisma: TenantPrismaClient;
  private config: IdempotencyConfig;

  constructor(prisma: TenantPrismaClient, config: IdempotencyConfig = {}) {
    this.prisma = prisma;
    this.config = {
      keyTtlSeconds: config.keyTtlSeconds || 24 * 60 * 60, // 24 hours
      maxRetries: config.maxRetries || 3,
      retryDelayMs: config.retryDelayMs || 100,
      ...config
    };
  }

  // Setup idempotency middleware on Prisma client
  static setupIdempotencyMiddleware(
    prisma: TenantPrismaClient, 
    config: IdempotencyConfig = {}
  ) {
    const manager = new IdempotencyManager(prisma, config);

    prisma.$use(async (params, next) => {
      const { model, action, args } = params;

      // Skip non-idempotent models and operations
      if (!model || 
          !IDEMPOTENT_MODELS.includes(model) || 
          !IDEMPOTENT_OPERATIONS.includes(action)) {
        return next(params);
      }

      // Check if requestId is provided in the data
      const requestId = args.data?.requestId;
      if (!requestId) {
        return next(params);
      }

      try {
        // Check for existing operation with this requestId
        const existingResult = await manager.checkExistingOperation(
          model,
          requestId,
          args
        );

        if (existingResult) {
          return existingResult.data;
        }

        // Execute the operation
        const result = await next(params);

        // Store the result for future idempotency checks
        await manager.storeOperationResult(
          model,
          requestId,
          args,
          result
        );

        return result;
      } catch (error) {
        console.error('Idempotency middleware error:', error);
        throw error;
      }
    });
  }

  // Execute an idempotent operation
  async executeIdempotent<T>(
    context: IdempotencyContext,
    operation: () => Promise<T>
  ): Promise<IdempotencyResult<T>> {
    const { requestId, endpoint, method } = context;
    
    // Generate a unique key for this operation
    const idempotencyKey = this.generateIdempotencyKey(context);

    // Check for existing result
    const existing = await this.getExistingResult<T>(idempotencyKey);
    if (existing) {
      return {
        data: existing.data,
        isFromCache: true,
        requestId
      };
    }

    // Execute the operation with retry logic for concurrent requests
    let attempts = 0;
    while (attempts < (this.config.maxRetries || 3)) {
      try {
        // Try to acquire lock
        const lockAcquired = await this.acquireLock(idempotencyKey);
        if (!lockAcquired) {
          // Another request is processing, wait and check for result
          await this.delay(this.config.retryDelayMs || 100);
          
          const retryResult = await this.getExistingResult<T>(idempotencyKey);
          if (retryResult) {
            return {
              data: retryResult.data,
              isFromCache: true,
              requestId
            };
          }
          
          attempts++;
          continue;
        }

        try {
          // Execute the operation
          const result = await operation();

          // Store the result
          await this.storeResult(idempotencyKey, result, context);

          return {
            data: result,
            isFromCache: false,
            requestId
          };
        } finally {
          // Release the lock
          await this.releaseLock(idempotencyKey);
        }
      } catch (error) {
        console.error(`Idempotent operation attempt ${attempts + 1} failed:`, error);
        
        if (attempts === (this.config.maxRetries || 3) - 1) {
          throw error;
        }
        
        attempts++;
        await this.delay(this.config.retryDelayMs || 100);
      }
    }

    throw new Error('Idempotent operation failed after maximum retries');
  }

  // Check for existing operation result
  private async checkExistingOperation(
    model: string,
    requestId: string,
    args: any
  ): Promise<{ data: any } | null> {
    try {
      if (model === 'Order') {
        const existingOrder = await this.prisma.order.findUnique({
          where: { requestId },
          include: {
            orderItems: {
              include: {
                menuItem: true
              }
            }
          }
        });

        return existingOrder ? { data: existingOrder } : null;
      }

      // Add other model checks as needed
      return null;
    } catch (error) {
      console.error('Error checking existing operation:', error);
      return null;
    }
  }

  // Store operation result for future idempotency checks
  private async storeOperationResult(
    model: string,
    requestId: string,
    args: any,
    result: any
  ): Promise<void> {
    // The result is already stored in the database with the requestId
    // This is primarily for in-memory caching if needed
    try {
      // Could implement Redis caching here for better performance
      console.log(`Stored idempotency result for ${model}:${requestId}`);
    } catch (error) {
      console.error('Error storing operation result:', error);
    }
  }

  // Generate idempotency key
  private generateIdempotencyKey(context: IdempotencyContext): string {
    const { userId, restaurantId, requestId, endpoint, method } = context;
    
    const keyData = [
      userId || 'anonymous',
      restaurantId || 'no-restaurant',
      requestId,
      endpoint,
      method
    ].join(':');

    return createHash('sha256').update(keyData).digest('hex');
  }

  // Get existing result from cache/database
  private async getExistingResult<T>(key: string): Promise<{ data: T } | null> {
    try {
      // This would typically check Redis cache first, then fallback to database
      // For now, we'll rely on the database requestId checks in the middleware
      return null;
    } catch (error) {
      console.error('Error getting existing result:', error);
      return null;
    }
  }

  // Acquire distributed lock
  private async acquireLock(key: string): Promise<boolean> {
    try {
      // In a production environment, this would use Redis with SET NX EX
      // For now, we'll simulate with a simple approach
      
      // Check if lock exists (you would implement this with Redis)
      const lockKey = `lock:${key}`;
      const lockExists = false; // Replace with actual Redis check
      
      if (lockExists) {
        return false;
      }

      // Set lock with expiration (you would implement this with Redis)
      // await redis.set(lockKey, '1', 'EX', 30); // 30 second expiration
      
      return true;
    } catch (error) {
      console.error('Error acquiring lock:', error);
      return false;
    }
  }

  // Release distributed lock
  private async releaseLock(key: string): Promise<void> {
    try {
      const lockKey = `lock:${key}`;
      // await redis.del(lockKey);
    } catch (error) {
      console.error('Error releasing lock:', error);
    }
  }

  // Store result in cache
  private async storeResult<T>(
    key: string, 
    result: T, 
    context: IdempotencyContext
  ): Promise<void> {
    try {
      const ttl = this.config.keyTtlSeconds || 24 * 60 * 60;
      
      // Store in Redis cache with TTL
      // await redis.setex(key, ttl, JSON.stringify({
      //   data: result,
      //   context,
      //   timestamp: Date.now()
      // }));
    } catch (error) {
      console.error('Error storing result:', error);
    }
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clean up expired idempotency keys
  async cleanupExpiredKeys(): Promise<void> {
    try {
      // This would typically clean up Redis keys
      // Also clean up database records older than TTL
      const cutoffDate = new Date(Date.now() - (this.config.keyTtlSeconds || 24 * 60 * 60) * 1000);
      
      // Clean up old orders with requestId
      await this.prisma.order.updateMany({
        where: {
          requestId: { not: null },
          createdAt: { lt: cutoffDate }
        },
        data: {
          requestId: null // Clear requestId after TTL
        }
      });

      console.log('Cleaned up expired idempotency keys');
    } catch (error) {
      console.error('Error cleaning up expired keys:', error);
    }
  }
}

// Helper function to generate request ID
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to extract request ID from headers or generate one
export function getOrGenerateRequestId(req: Request): string {
  const existingRequestId = req.headers.get('idempotency-key') || 
                           req.headers.get('x-request-id');
  
  return existingRequestId || generateRequestId();
}

// Helper function to create idempotency context from request
export function createIdempotencyContext(
  req: Request,
  tenantContext: { userId?: string; restaurantId?: string }
): IdempotencyContext {
  return {
    userId: tenantContext.userId,
    restaurantId: tenantContext.restaurantId,
    requestId: getOrGenerateRequestId(req),
    endpoint: new URL(req.url).pathname,
    method: req.method
  };
}

// Decorator for making functions idempotent
export function Idempotent(config: IdempotencyConfig = {}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const manager = new IdempotencyManager(this.prisma, config);
      
      // Extract context from method arguments or class properties
      const context: IdempotencyContext = {
        userId: this.userId,
        restaurantId: this.restaurantId,
        requestId: this.requestId || generateRequestId(),
        endpoint: propertyName,
        method: 'FUNCTION_CALL'
      };

      return manager.executeIdempotent(context, () => method.apply(this, args));
    };

    return descriptor;
  };
}

export default IdempotencyManager;