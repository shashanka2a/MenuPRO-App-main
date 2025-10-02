import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { createTenantPrisma, extractTenantContext } from './prisma-tenant';
import { sign, verify } from 'jsonwebtoken';
import AuditLogger from './audit-middleware';

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  jwtSecret: string;
  jwtExpirationTime?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  memberships: {
    id: string;
    restaurantId: string;
    role: string;
    isActive: boolean;
    restaurant: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface JWTPayload {
  sub: string;
  email: string;
  restaurant_id?: string;
  role?: string;
  permissions?: string[];
  iat: number;
  exp: number;
}

export class SupabaseAuthService {
  private supabase: SupabaseClient;
  private serviceSupabase: SupabaseClient;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    this.serviceSupabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
  }

  // Initialize authentication for client-side
  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Sign in with email and OTP
  async signInWithOTP(email: string, options?: { 
    redirectTo?: string;
    shouldCreateUser?: boolean;
  }) {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: options?.shouldCreateUser ?? true,
        emailRedirectTo: options?.redirectTo
      }
    });

    if (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }

    return data;
  }

  // Sign in with phone and OTP
  async signInWithPhoneOTP(phone: string) {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      phone
    });

    if (error) {
      throw new Error(`Phone authentication failed: ${error.message}`);
    }

    return data;
  }

  // Verify OTP
  async verifyOTP(email: string, token: string, type: 'email' | 'sms' = 'email') {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type
    });

    if (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }

    // Sync user with local database
    if (data.user) {
      await this.syncUserWithDatabase(data.user);
    }

    return data;
  }

  // Get current user session
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return this.getUserWithMemberships(user.id);
  }

  // Sync Supabase user with local database
  async syncUserWithDatabase(supabaseUser: User): Promise<AuthUser> {
    const prisma = createTenantPrisma({});
    
    try {
      // Upsert user in local database
      const user = await prisma.user.upsert({
        where: { id: supabaseUser.id },
        update: {
          email: supabaseUser.email!,
          phone: supabaseUser.phone,
          emailVerified: !!supabaseUser.email_confirmed_at,
          phoneVerified: !!supabaseUser.phone_confirmed_at,
          lastLogin: new Date(),
          updatedAt: new Date()
        },
        create: {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          phone: supabaseUser.phone,
          firstName: supabaseUser.user_metadata?.first_name,
          lastName: supabaseUser.user_metadata?.last_name,
          avatar: supabaseUser.user_metadata?.avatar_url,
          emailVerified: !!supabaseUser.email_confirmed_at,
          phoneVerified: !!supabaseUser.phone_confirmed_at,
          lastLogin: new Date()
        }
      });

      // Log authentication event
      const auditLogger = new AuditLogger(prisma, {
        userId: user.id,
        metadata: { event: 'user_sync' }
      });
      
      await auditLogger.logCustomEvent(
        'LOGIN',
        'User',
        user.id,
        null,
        { email: user.email, syncedAt: new Date() }
      );

      return this.getUserWithMemberships(user.id);
    } catch (error) {
      console.error('Error syncing user with database:', error);
      throw error;
    }
  }

  // Get user with memberships
  async getUserWithMemberships(userId: string): Promise<AuthUser> {
    const prisma = createTenantPrisma({});
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { isActive: true },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone || undefined,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      avatar: user.avatar || undefined,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      memberships: user.memberships.map(m => ({
        id: m.id,
        restaurantId: m.restaurantId,
        role: m.role,
        isActive: m.isActive,
        restaurant: m.restaurant
      }))
    };
  }

  // Generate custom JWT with restaurant context
  async generateCustomJWT(
    userId: string, 
    restaurantId?: string,
    options?: { expiresIn?: string }
  ): Promise<string> {
    const user = await this.getUserWithMemberships(userId);
    
    let selectedMembership = null;
    if (restaurantId) {
      selectedMembership = user.memberships.find(m => m.restaurantId === restaurantId);
      if (!selectedMembership) {
        throw new Error('User does not have access to the specified restaurant');
      }
    } else if (user.memberships.length > 0) {
      // Default to first active membership
      selectedMembership = user.memberships[0];
    }

    const payload: JWTPayload = {
      sub: userId,
      email: user.email,
      restaurant_id: selectedMembership?.restaurantId,
      role: selectedMembership?.role,
      permissions: this.getRolePermissions(selectedMembership?.role),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.getExpirationSeconds(options?.expiresIn)
    };

    return sign(payload, this.config.jwtSecret);
  }

  // Verify and decode custom JWT
  async verifyCustomJWT(token: string): Promise<JWTPayload> {
    try {
      const payload = verify(token, this.config.jwtSecret) as JWTPayload;
      
      // Additional validation: ensure user still has access to restaurant
      if (payload.restaurant_id) {
        const user = await this.getUserWithMemberships(payload.sub);
        const hasAccess = user.memberships.some(
          m => m.restaurantId === payload.restaurant_id && m.isActive
        );
        
        if (!hasAccess) {
          throw new Error('User no longer has access to restaurant');
        }
      }

      return payload;
    } catch (error) {
      throw new Error(`Invalid token: ${error}`);
    }
  }

  // Create restaurant membership
  async createMembership(
    userId: string,
    restaurantId: string,
    role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'CUSTOMER',
    createdBy: string
  ) {
    const prisma = createTenantPrisma({ userId: createdBy, restaurantId });
    
    const membership = await prisma.membership.create({
      data: {
        userId,
        restaurantId,
        role,
        isActive: true
      }
    });

    // Log membership creation
    const auditLogger = new AuditLogger(prisma, {
      userId: createdBy,
      restaurantId,
      metadata: { 
        event: 'membership_created',
        targetUserId: userId,
        role 
      }
    });
    
    await auditLogger.logCustomEvent(
      'CREATE',
      'Membership',
      membership.id,
      null,
      membership
    );

    return membership;
  }

  // Sign out user
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }

    return { success: true };
  }

  // Refresh session
  async refreshSession() {
    const { data, error } = await this.supabase.auth.refreshSession();
    
    if (error) {
      throw new Error(`Session refresh failed: ${error.message}`);
    }

    return data;
  }

  // Get role permissions
  private getRolePermissions(role?: string): string[] {
    const permissions: Record<string, string[]> = {
      CUSTOMER: ['orders:create', 'orders:read:own', 'menu:read'],
      STAFF: ['orders:read:all', 'orders:update:status', 'menu:read'],
      MANAGER: ['orders:*', 'menu:*', 'tables:*', 'staff:read'],
      ADMIN: ['*'],
      OWNER: ['*']
    };

    return permissions[role || 'CUSTOMER'] || permissions.CUSTOMER;
  }

  // Convert expiration string to seconds
  private getExpirationSeconds(expiresIn?: string): number {
    if (!expiresIn) {
      return 24 * 60 * 60; // 24 hours default
    }

    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 24 * 60 * 60;
    }

    const [, value, unit] = match;
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    
    return parseInt(value) * (multipliers[unit as keyof typeof multipliers] || 3600);
  }

  // Admin functions for user management
  async adminCreateUser(email: string, password: string, userData: any) {
    const { data, error } = await this.serviceSupabase.auth.admin.createUser({
      email,
      password,
      user_metadata: userData,
      email_confirm: true
    });

    if (error) {
      throw new Error(`Admin user creation failed: ${error.message}`);
    }

    if (data.user) {
      await this.syncUserWithDatabase(data.user);
    }

    return data;
  }

  async adminUpdateUser(userId: string, updates: any) {
    const { data, error } = await this.serviceSupabase.auth.admin.updateUserById(
      userId,
      updates
    );

    if (error) {
      throw new Error(`Admin user update failed: ${error.message}`);
    }

    if (data.user) {
      await this.syncUserWithDatabase(data.user);
    }

    return data;
  }

  async adminDeleteUser(userId: string) {
    const { data, error } = await this.serviceSupabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(`Admin user deletion failed: ${error.message}`);
    }

    // Deactivate user in local database
    const prisma = createTenantPrisma({});
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });

    return data;
  }
}

// Singleton instance
let authService: SupabaseAuthService;

export function createAuthService(config: AuthConfig): SupabaseAuthService {
  if (!authService) {
    authService = new SupabaseAuthService(config);
  }
  return authService;
}

export function getAuthService(): SupabaseAuthService {
  if (!authService) {
    throw new Error('Auth service not initialized. Call createAuthService first.');
  }
  return authService;
}

// Middleware helper for Next.js API routes
export async function withAuth(
  req: Request,
  handler: (req: Request, user: AuthUser, context: any) => Promise<Response>
): Promise<Response> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.substring(7);
    const authService = getAuthService();
    const payload = await authService.verifyCustomJWT(token);
    const user = await authService.getUserWithMemberships(payload.sub);

    const context = extractTenantContext(token);
    
    return handler(req, user, context);
  } catch (error) {
    console.error('Authentication error:', error);
    return new Response('Unauthorized', { status: 401 });
  }
}

export default SupabaseAuthService;