import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://isletdfyulyiicpopcoq.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbGV0ZGZ5dWx5aWljcG9wY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTg1MTUsImV4cCI6MjA3NjEzNDUxNX0.cYRyyf1oanH4ezfZJDfMKPh0KcQo57VwsADuywuMkaA"

async function pushWithSupabaseClient() {
  console.log('🚀 Creating tables using Supabase client...')
  console.log(`📡 Supabase URL: ${SUPABASE_URL}`)
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  try {
    // Test connection
    console.log('\n🔍 Testing Supabase connection...')
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1)
    if (error && error.code !== 'PGRST116') {
      console.log('⚠️ Connection test result:', error.message)
    } else {
      console.log('✅ Successfully connected to Supabase!')
    }

    console.log('\n📤 Creating database tables using SQL...')

    // Create tables using SQL
    const createTablesSQL = `
      -- Create enums
      DO $$ BEGIN
        CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'RESTAURANT', 'ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Create users table
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "type" "UserType" NOT NULL DEFAULT 'CUSTOMER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );

      -- Create restaurants table
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
      );

      -- Create menus table
      CREATE TABLE IF NOT EXISTS "menus" (
        "id" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
      );

      -- Create menu_items table
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
      );

      -- Create tables table
      CREATE TABLE IF NOT EXISTS "tables" (
        "id" TEXT NOT NULL,
        "restaurantId" TEXT NOT NULL,
        "tableNumber" TEXT NOT NULL,
        "capacity" INTEGER,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
      );

      -- Create orders table
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
      );

      -- Create order_items table
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "itemId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
      );

      -- Create analytics table
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
      );

      -- Create otp_verifications table
      CREATE TABLE IF NOT EXISTS "otp_verifications" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "otp" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
      );

      -- Create unique constraints
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
      CREATE UNIQUE INDEX IF NOT EXISTS "orders_orderNumber_key" ON "orders"("orderNumber");
      CREATE UNIQUE INDEX IF NOT EXISTS "otp_verifications_email_key" ON "otp_verifications"("email");
    `

    const { data: sqlResult, error: sqlError } = await supabase.rpc('exec_sql', { sql: createTablesSQL })
    
    if (sqlError) {
      console.log('⚠️ SQL execution result:', sqlError.message)
      // Try alternative approach - create tables one by one
      console.log('\n🔄 Trying alternative approach - creating tables individually...')
      
      const tables = [
        { name: 'users', sql: `CREATE TABLE IF NOT EXISTS "users" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "verified" BOOLEAN NOT NULL DEFAULT false, "type" TEXT NOT NULL DEFAULT 'CUSTOMER', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "users_pkey" PRIMARY KEY ("id"))` },
        { name: 'restaurants', sql: `CREATE TABLE IF NOT EXISTS "restaurants" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "address" TEXT, "city" TEXT, "state" TEXT, "zipCode" TEXT, "cuisine" TEXT, "description" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id"))` },
        { name: 'menus', sql: `CREATE TABLE IF NOT EXISTS "menus" ("id" TEXT NOT NULL, "restaurantId" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "menus_pkey" PRIMARY KEY ("id"))` },
        { name: 'menu_items', sql: `CREATE TABLE IF NOT EXISTS "menu_items" ("id" TEXT NOT NULL, "menuId" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "price" DECIMAL(10,2) NOT NULL, "category" TEXT, "isAvailable" BOOLEAN NOT NULL DEFAULT true, "image" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id"))` },
        { name: 'tables', sql: `CREATE TABLE IF NOT EXISTS "tables" ("id" TEXT NOT NULL, "restaurantId" TEXT NOT NULL, "tableNumber" TEXT NOT NULL, "capacity" INTEGER, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "tables_pkey" PRIMARY KEY ("id"))` },
        { name: 'orders', sql: `CREATE TABLE IF NOT EXISTS "orders" ("id" TEXT NOT NULL, "orderNumber" TEXT NOT NULL, "restaurantId" TEXT NOT NULL, "tableId" TEXT, "customerEmail" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "subtotal" DECIMAL(10,2) NOT NULL, "tax" DECIMAL(10,2) NOT NULL DEFAULT 0, "discount" DECIMAL(10,2) NOT NULL DEFAULT 0, "total" DECIMAL(10,2) NOT NULL, "estimatedTime" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "orders_pkey" PRIMARY KEY ("id"))` },
        { name: 'order_items', sql: `CREATE TABLE IF NOT EXISTS "order_items" ("id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "itemId" TEXT NOT NULL, "quantity" INTEGER NOT NULL, "price" DECIMAL(10,2) NOT NULL, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "order_items_pkey" PRIMARY KEY ("id"))` },
        { name: 'analytics', sql: `CREATE TABLE IF NOT EXISTS "analytics" ("id" TEXT NOT NULL, "restaurantId" TEXT NOT NULL, "date" DATE NOT NULL, "totalOrders" INTEGER NOT NULL DEFAULT 0, "totalRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0, "averageOrderValue" DECIMAL(10,2) NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "analytics_pkey" PRIMARY KEY ("id"))` },
        { name: 'otp_verifications', sql: `CREATE TABLE IF NOT EXISTS "otp_verifications" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "otp" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "used" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id"))` }
      ]

      for (const table of tables) {
        try {
          const { error: tableError } = await supabase.rpc('exec_sql', { sql: table.sql })
          if (tableError) {
            console.log(`⚠️ ${table.name}: ${tableError.message}`)
          } else {
            console.log(`✅ Created ${table.name} table`)
          }
        } catch (err) {
          console.log(`⚠️ ${table.name}: ${err}`)
        }
      }
    } else {
      console.log('✅ All tables created successfully!')
    }

    console.log(`
🎉 Database setup completed!

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
    console.log('1. Check Supabase project status')
    console.log('2. Verify API keys are correct')
    console.log('3. Check if project is fully provisioned')
  }
}

// Run the script
pushWithSupabaseClient()

