import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://isletdfyulyiicpopcoq.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbGV0ZGZ5dWx5aWljcG9wY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTg1MTUsImV4cCI6MjA3NjEzNDUxNX0.cYRyyf1oanH4ezfZJDfMKPh0KcQo57VwsADuywuMkaA"

async function createTablesSQL() {
  console.log('🚀 Creating SQL script for Supabase tables...')
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

    // Generate SQL script
    const sqlScript = `
-- MenuOS Database Schema for Supabase
-- Run this script in Supabase SQL Editor

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

-- Add foreign key constraints
ALTER TABLE "menus" ADD CONSTRAINT "menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tables" ADD CONSTRAINT "tables_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerEmail_fkey" FOREIGN KEY ("customerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "otp_verifications" ADD CONSTRAINT "otp_verifications_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
`

    // Write SQL script to file
    const fs = require('fs')
    fs.writeFileSync('supabase-schema.sql', sqlScript)
    
    console.log(`
🎉 SQL script generated successfully!

📄 File created: supabase-schema.sql

📋 Next steps:
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq
2. Navigate to SQL Editor
3. Copy and paste the contents of supabase-schema.sql
4. Run the SQL script to create all tables
5. Verify tables are created in Table Editor

🔗 Direct links:
- SQL Editor: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq/sql
- Table Editor: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq/editor

📊 Tables that will be created:
✅ users - User profiles and authentication
✅ restaurants - Restaurant information
✅ menus - Menu configurations  
✅ menu_items - Individual menu items
✅ tables - Restaurant table management
✅ orders - Order tracking
✅ order_items - Order line items
✅ analytics - Performance metrics
✅ otp_verifications - Email verification
    `)

  } catch (error) {
    console.error('❌ Error generating SQL script:', error)
  }
}

// Run the script
createTablesSQL()

