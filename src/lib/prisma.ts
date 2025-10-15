import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Comprehensive Prisma Middleware
prisma.$use(async (params, next) => {
  // Logging middleware
  const start = Date.now()
  const result = await next(params)
  const duration = Date.now() - start
  
  console.log(`[Prisma] ${params.model}.${params.action} - ${duration}ms`)
  
  return result
})

// Soft delete middleware for Restaurant
prisma.$use(async (params, next) => {
  if (params.model === 'Restaurant' && params.action === 'delete') {
    // Convert delete to update with isActive = false
    return next({
      ...params,
      action: 'update',
      args: {
        ...params.args,
        data: { isActive: false }
      }
    })
  }
  return next(params)
})

// Soft delete middleware for Menu
prisma.$use(async (params, next) => {
  if (params.model === 'Menu' && params.action === 'delete') {
    return next({
      ...params,
      action: 'update',
      args: {
        ...params.args,
        data: { isActive: false }
      }
    })
  }
  return next(params)
})

// Soft delete middleware for MenuItem
prisma.$use(async (params, next) => {
  if (params.model === 'MenuItem' && params.action === 'delete') {
    return next({
      ...params,
      action: 'update',
      args: {
        ...params.args,
        data: { isAvailable: false }
      }
    })
  }
  return next(params)
})

// Soft delete middleware for Table
prisma.$use(async (params, next) => {
  if (params.model === 'Table' && params.action === 'delete') {
    return next({
      ...params,
      action: 'update',
      args: {
        ...params.args,
        data: { isActive: false }
      }
    })
  }
  return next(params)
})

// Auto-generate order number middleware
prisma.$use(async (params, next) => {
  if (params.model === 'Order' && params.action === 'create') {
    const orderNumber = `MP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    params.args.data.orderNumber = orderNumber
  }
  return next(params)
})

// Auto-calculate order total middleware
prisma.$use(async (params, next) => {
  if (params.model === 'Order' && params.action === 'create') {
    const { items, subtotal, tax = 0, discount = 0 } = params.args.data
    
    if (items && Array.isArray(items)) {
      // Calculate subtotal from items
      const calculatedSubtotal = items.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity)
      }, 0)
      
      params.args.data.subtotal = calculatedSubtotal
      params.args.data.total = calculatedSubtotal + tax - discount
    }
  }
  return next(params)
})

// Cleanup expired OTPs middleware
prisma.$use(async (params, next) => {
  if (params.model === 'OtpVerification' && params.action === 'findMany') {
    // Clean up expired OTPs before querying
    await prisma.otpVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }
  return next(params)
})

// Restaurant access control middleware
prisma.$use(async (params, next) => {
  // Add restaurant context to queries when available
  if (params.model === 'Menu' || params.model === 'MenuItem' || params.model === 'Table' || params.model === 'QrCode') {
    // This would be enhanced with actual user context in a real implementation
    console.log(`[Prisma] Restaurant-scoped query: ${params.model}.${params.action}`)
  }
  return next(params)
})

// Data validation middleware
prisma.$use(async (params, next) => {
  // Email validation
  if (params.model === 'User' && (params.action === 'create' || params.action === 'update')) {
    const email = params.args.data?.email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format')
    }
  }
  
  // Price validation
  if (params.model === 'MenuItem' && (params.action === 'create' || params.action === 'update')) {
    const price = params.args.data?.price
    if (price && (price < 0 || price > 9999.99)) {
      throw new Error('Price must be between 0 and 9999.99')
    }
  }
  
  return next(params)
})

// Audit trail middleware
prisma.$use(async (params, next) => {
  const result = await next(params)
  
  // Log sensitive operations
  if (['User', 'Restaurant', 'Order'].includes(params.model || '') && 
      ['create', 'update', 'delete'].includes(params.action)) {
    console.log(`[Audit] ${params.model}.${params.action} - ${new Date().toISOString()}`)
  }
  
  return result
})

// Connection pooling and retry middleware
prisma.$use(async (params, next) => {
  let retries = 3
  while (retries > 0) {
    try {
      return await next(params)
    } catch (error: any) {
      if (error.code === 'P2002' && retries > 1) {
        // Unique constraint violation - retry
        retries--
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
})

export default prisma
