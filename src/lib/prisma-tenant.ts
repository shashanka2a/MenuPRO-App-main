import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Global context for tenant isolation
interface TenantContext {
  userId?: string;
  restaurantId?: string;
  role?: string;
  permissions?: string[];
}

// Extend PrismaClient with tenant context
class TenantPrismaClient extends PrismaClient {
  private tenantContext: TenantContext = {};

  constructor(options?: any) {
    super(options);
    this.setupTenantMiddleware();
  }

  // Set tenant context from JWT claims
  setTenantContext(context: TenantContext) {
    this.tenantContext = context;
  }

  // Get current tenant context
  getTenantContext(): TenantContext {
    return this.tenantContext;
  }

  private setupTenantMiddleware() {
    // Middleware to auto-inject restaurantId into queries
    this.$use(async (params, next) => {
      const { model, action, args } = params;
      
      // Skip middleware for non-tenant models
      const nonTenantModels = ['User']; // Add models that don't have restaurantId
      if (nonTenantModels.includes(model || '')) {
        return next(params);
      }

      // Models that require restaurantId
      const tenantModels = [
        'Restaurant',
        'Membership', 
        'Table',
        'MenuVersion',
        'MenuItem',
        'Order',
        'AuditLog'
      ];

      if (!tenantModels.includes(model || '')) {
        return next(params);
      }

      const restaurantId = this.tenantContext.restaurantId;
      
      // Auto-inject restaurantId for read operations
      if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'].includes(action)) {
        if (restaurantId) {
          // Add restaurantId filter if not already present
          if (!args.where) {
            args.where = {};
          }
          
          // Only add restaurantId filter if not already specified
          if (!args.where.restaurantId) {
            args.where.restaurantId = restaurantId;
          }
        }
      }

      // Auto-inject restaurantId for write operations
      if (['create', 'createMany'].includes(action)) {
        if (restaurantId) {
          if (action === 'create' && args.data) {
            if (!args.data.restaurantId) {
              args.data.restaurantId = restaurantId;
            }
          } else if (action === 'createMany' && args.data) {
            // Handle createMany
            if (Array.isArray(args.data)) {
              args.data = args.data.map((item: any) => ({
                ...item,
                restaurantId: item.restaurantId || restaurantId
              }));
            }
          }
        }
      }

      // Auto-inject restaurantId for update operations
      if (['update', 'updateMany', 'upsert'].includes(action)) {
        if (restaurantId) {
          if (!args.where) {
            args.where = {};
          }
          
          // Add restaurantId to where clause if not present
          if (!args.where.restaurantId) {
            args.where.restaurantId = restaurantId;
          }
        }
      }

      // Auto-inject restaurantId for delete operations
      if (['delete', 'deleteMany'].includes(action)) {
        if (restaurantId) {
          if (!args.where) {
            args.where = {};
          }
          
          // Add restaurantId to where clause if not present
          if (!args.where.restaurantId) {
            args.where.restaurantId = restaurantId;
          }
        }
      }

      return next(params);
    });

    // Middleware for access control validation
    this.$use(async (params, next) => {
      const { model, action } = params;
      const { userId, restaurantId, role } = this.tenantContext;

      // Skip validation for system operations
      if (!userId && !restaurantId) {
        return next(params);
      }

      // Validate user has access to the restaurant
      if (restaurantId && userId) {
        const membership = await this.membership.findFirst({
          where: {
            userId,
            restaurantId,
            isActive: true
          }
        });

        if (!membership) {
          throw new Error('Access denied: User does not have access to this restaurant');
        }
      }

      // Role-based access control
      const result = await this.validateRoleAccess(model, action, role);
      if (!result.allowed) {
        throw new Error(`Access denied: ${result.reason}`);
      }

      return next(params);
    });
  }

  private async validateRoleAccess(
    model: string | undefined, 
    action: string, 
    role?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    if (!model || !role) {
      return { allowed: true }; // Allow if no model or role specified
    }

    // Define role hierarchy
    const roleHierarchy = {
      CUSTOMER: 1,
      STAFF: 2,
      MANAGER: 3,
      ADMIN: 4,
      OWNER: 5
    };

    const userRoleLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;

    // Define minimum role requirements for operations
    const accessRules: Record<string, Record<string, number>> = {
      Restaurant: {
        findFirst: 1, findMany: 1, findUnique: 1,
        update: 4, delete: 5, create: 5
      },
      Table: {
        findFirst: 1, findMany: 1, findUnique: 1,
        create: 3, update: 3, delete: 3
      },
      MenuVersion: {
        findFirst: 1, findMany: 1, findUnique: 1,
        create: 3, update: 3, delete: 3
      },
      MenuItem: {
        findFirst: 1, findMany: 1, findUnique: 1,
        create: 3, update: 3, delete: 3
      },
      Order: {
        findFirst: 1, findMany: 2, findUnique: 1,
        create: 1, update: 2, delete: 3
      },
      Membership: {
        findFirst: 2, findMany: 3, findUnique: 2,
        create: 3, update: 3, delete: 4
      },
      AuditLog: {
        findFirst: 4, findMany: 4, findUnique: 4,
        create: 1, update: 5, delete: 5
      }
    };

    const modelRules = accessRules[model];
    if (!modelRules) {
      return { allowed: true }; // Allow if no rules defined
    }

    const requiredLevel = modelRules[action];
    if (requiredLevel === undefined) {
      return { allowed: true }; // Allow if no rule for action
    }

    if (userRoleLevel < requiredLevel) {
      return { 
        allowed: false, 
        reason: `Role ${role} (level ${userRoleLevel}) insufficient for ${action} on ${model} (requires level ${requiredLevel})` 
      };
    }

    return { allowed: true };
  }

  // Utility method to safely execute tenant-scoped queries
  async withTenant<T>(tenantContext: TenantContext, operation: () => Promise<T>): Promise<T> {
    const previousContext = this.tenantContext;
    this.setTenantContext(tenantContext);
    
    try {
      return await operation();
    } finally {
      this.setTenantContext(previousContext);
    }
  }
}

// Singleton instance
let prisma: TenantPrismaClient;

declare global {
  var __prisma: TenantPrismaClient | undefined;
}

// Create prisma client with proper singleton pattern
if (process.env.NODE_ENV === 'production') {
  prisma = new TenantPrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new TenantPrismaClient();
  }
  prisma = global.__prisma;
}

// Helper function to extract tenant context from JWT token
export function extractTenantContext(authToken?: string): TenantContext {
  if (!authToken) {
    return {};
  }

  try {
    // Decode JWT token (you might want to use a proper JWT library)
    const payload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString()
    );

    return {
      userId: payload.sub,
      restaurantId: payload.restaurant_id,
      role: payload.role,
      permissions: payload.permissions || []
    };
  } catch (error) {
    console.error('Error extracting tenant context from token:', error);
    return {};
  }
}

// Helper function to create prisma client with tenant context
export function createTenantPrisma(tenantContext: TenantContext): TenantPrismaClient {
  prisma.setTenantContext(tenantContext);
  return prisma;
}

// Helper function to get prisma client with tenant context from request headers
export function getPrismaFromRequest(req: Request): TenantPrismaClient {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const tenantContext = extractTenantContext(token);
  
  return createTenantPrisma(tenantContext);
}

export { prisma, TenantPrismaClient };
export default prisma;