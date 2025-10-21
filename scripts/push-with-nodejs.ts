import { PrismaClient } from '@prisma/client'

const SUPABASE_DATABASE_URL = "postgresql://postgres:ETnpJs32ewdBtHhl@db.isletdfyulyiicpopcoq.supabase.co:5432/postgres?sslmode=require"

async function pushWithNodeJS() {
  console.log('🚀 Pushing Prisma schema to Supabase using Node.js...')
  console.log(`📡 Database URL: ${SUPABASE_DATABASE_URL}`)
  
  // Create Prisma client with the Supabase connection
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_DATABASE_URL
      }
    },
    log: ['query', 'info', 'warn', 'error']
  })

  try {
    // Test connection
    console.log('\n🔍 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Successfully connected to Supabase database!')

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('📊 Database version:', result)

    // Create tables using raw SQL
    console.log('\n📤 Creating database tables...')
    
    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "type" "UserType" NOT NULL DEFAULT 'CUSTOMER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created users table')

    // Create restaurants table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "restaurants" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "city" TEXT,
        "state" TEXT,
        "zipCode" TEXT,
        "cuisine" TEXT,
        "description" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created restaurants table')

    // Create menus table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "menus" (
        "id" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created menus table')

    // Create menu_items table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "menu_items" (
        "id" TEXT NOT NULL,
        "menuId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" DECIMAL(10,2) NOT NULL,
        "category" TEXT,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "image" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created menu_items table')

    // Create tables table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "tables" (
        "id" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL,
        "tableNumber" TEXT NOT NULL,
        "capacity" INTEGER,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created tables table')

    // Create orders table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" TEXT NOT NULL,
        "orderNumber" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL,
        "tableId" TEXT,
        "customerEmail" TEXT NOT NULL,
        "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
        "subtotal" DECIMAL(10,2) NOT NULL,
        "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "total" DECIMAL(10,2) NOT NULL,
        "estimatedTime" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created orders table')

    // Create order_items table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "itemId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created order_items table')

    // Create analytics table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "analytics" (
        "id" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL,
        "date" DATE NOT NULL,
        "totalOrders" INTEGER NOT NULL DEFAULT 0,
        "totalRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "averageOrderValue" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created analytics table')

    // Create otp_verifications table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "otp_verifications" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "otp" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Created otp_verifications table')

    // Create enums
    await prisma.$executeRaw`CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'RESTAURANT', 'ADMIN')`
    await prisma.$executeRaw`CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')`
    console.log('✅ Created enums')

    // Add unique constraints
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "orders_orderNumber_key" ON "orders"("orderNumber")`
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "otp_verifications_email_key" ON "otp_verifications"("email")`
    console.log('✅ Created unique constraints')

    console.log(`
🎉 SUCCESS! All database tables created in Supabase!

📊 Tables created:
✅ users - User profiles and authentication
✅ restaurants - Restaurant information
✅ menus - Menu configurations  
✅ menu_items - Individual menu items
✅ tables - Restaurant table management
✅ orders - Order tracking
✅ order_items - Order line items
✅ analytics - Performance metrics
✅ otp_verifications - Email verification

🔗 Check your Supabase dashboard:
https://supabase.com/dashboard/project/isletdfyulyiicpopcoq

📋 Next steps:
1. Verify tables in Supabase Table Editor
2. Run: npm run db:seed (to add sample data)
3. Test your application with real database
    `)

  } catch (error) {
    console.error('❌ Error creating tables:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check if tables already exist')
    console.log('2. Verify database permissions')
    console.log('3. Check Supabase project status')
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
pushWithNodeJS()
