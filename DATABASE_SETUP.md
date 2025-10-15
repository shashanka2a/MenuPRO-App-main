# MenuPRO Database Setup Guide

## Overview

MenuPRO now includes a comprehensive Prisma-based database setup with PostgreSQL, featuring:

- **Complete data models** for restaurants, menus, orders, users, and analytics
- **Comprehensive middleware** for logging, soft deletes, validation, and more
- **Database helpers** for common operations
- **Seed data** for development and testing
- **Cleanup scripts** for maintenance

## Prerequisites

- PostgreSQL database (local or cloud)
- Node.js 18+
- npm or yarn

## Quick Start

### 1. Environment Setup

Copy the environment example file:
```bash
cp env.example .env.local
```

Update `.env.local` with your database credentials:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/menupro_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
# ... other variables
```

### 2. Database Setup

Generate Prisma client:
```bash
npm run db:generate
```

Push schema to database (for development):
```bash
npm run db:push
```

Or create and run migrations (for production):
```bash
npm run db:migrate
```

### 3. Seed Database

Populate with sample data:
```bash
npm run db:seed
```

### 4. View Database

Open Prisma Studio to explore your data:
```bash
npm run db:studio
```

## Database Schema

### Core Models

#### Users & Authentication
- **User**: Customer and restaurant accounts
- **OtpVerification**: Email verification codes
- **Restaurant**: Restaurant profiles and settings

#### Menu Management
- **Menu**: Restaurant menu collections
- **MenuItem**: Individual menu items with pricing
- **MenuItemOption**: Size, add-on options
- **OptionValue**: Specific option values
- **MenuItemCustomization**: Custom modifications

#### Table & QR Management
- **Table**: Restaurant table management
- **QrCode**: QR codes linking to tables

#### Order Management
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items in orders

#### Analytics
- **Analytics**: Daily restaurant performance metrics

## Prisma Middleware Features

### 1. Logging Middleware
- Logs all database operations with timing
- Helps with performance monitoring

### 2. Soft Delete Middleware
- Automatically converts deletes to updates for:
  - Restaurants (`isActive = false`)
  - Menus (`isActive = false`)
  - Menu Items (`isAvailable = false`)
  - Tables (`isActive = false`)

### 3. Auto-Generation Middleware
- **Order Numbers**: Auto-generates unique order numbers
- **Order Totals**: Calculates totals from items

### 4. Data Validation Middleware
- **Email Validation**: Ensures proper email format
- **Price Validation**: Validates price ranges

### 5. Cleanup Middleware
- **Expired OTPs**: Automatically removes expired verification codes
- **Restaurant Scoping**: Adds context to restaurant queries

### 6. Audit Trail Middleware
- Logs sensitive operations for compliance
- Tracks create/update/delete operations

### 7. Connection Pooling
- Retry logic for connection issues
- Handles unique constraint violations

## Database Helpers

### DatabaseHelpers Class

```typescript
import { DatabaseHelpers } from '@/lib/db-helpers'

// User Management
await DatabaseHelpers.createUser('user@example.com', UserType.CUSTOMER)
await DatabaseHelpers.verifyOTP('user@example.com', '123456')

// Restaurant Management
await DatabaseHelpers.createRestaurant({
  name: 'My Restaurant',
  email: 'restaurant@example.com',
  // ... other fields
})

// Order Management
await DatabaseHelpers.createOrder({
  restaurantId: 'rest-id',
  customerEmail: 'customer@example.com',
  items: [...],
  subtotal: 25.99
})
```

### TransactionHelpers Class

```typescript
import { TransactionHelpers } from '@/lib/db-helpers'

// Complex transactions
await TransactionHelpers.withTransaction(async (tx) => {
  const order = await tx.order.create({...})
  const items = await tx.orderItem.createMany({...})
  return { order, items }
})
```

### QueryHelpers Class

```typescript
import { QueryHelpers } from '@/lib/db-helpers'

// Optimized queries
const dashboard = await QueryHelpers.getRestaurantDashboard('rest-id')
const orderSummary = await QueryHelpers.getOrderSummary('order-id')
```

## Available Scripts

```bash
# Database Management
npm run db:generate      # Generate Prisma client
npm run db:push         # Push schema to database (dev)
npm run db:migrate      # Create and run migrations
npm run db:migrate:deploy # Deploy migrations (production)

# Data Management
npm run db:seed         # Seed database with sample data
npm run db:cleanup      # Clean up expired data
npm run db:reset        # Reset database (dev only)
npm run db:studio       # Open Prisma Studio
```

## Production Considerations

### 1. Database Connection
- Use connection pooling for production
- Set appropriate connection limits
- Monitor connection usage

### 2. Migrations
- Always use migrations in production
- Test migrations on staging first
- Have rollback plans ready

### 3. Performance
- Add database indexes for frequently queried fields
- Use database-level constraints
- Monitor query performance

### 4. Security
- Use strong JWT secrets
- Implement proper access controls
- Regular security audits

### 5. Backup Strategy
- Regular automated backups
- Point-in-time recovery capability
- Test restore procedures

## Monitoring & Maintenance

### Health Checks
```typescript
import { DatabaseHelpers } from '@/lib/db-helpers'

const health = await DatabaseHelpers.healthCheck()
console.log(health) // { status: 'healthy', timestamp: '...' }
```

### Cleanup Operations
```bash
# Run daily cleanup
npm run db:cleanup

# Manual cleanup of specific data
# (implement based on your needs)
```

### Performance Monitoring
- Monitor slow queries
- Track connection pool usage
- Set up alerts for database issues

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check DATABASE_URL format
   - Verify database server is running
   - Check network connectivity

2. **Migration Failures**
   - Check for data conflicts
   - Verify schema changes
   - Use `db:reset` for development

3. **Performance Issues**
   - Add database indexes
   - Optimize queries
   - Check connection pooling

### Getting Help

- Check Prisma documentation: https://www.prisma.io/docs/
- Review database logs
- Use Prisma Studio for data inspection
- Check middleware logs for issues

## Next Steps

1. **Set up production database** (PostgreSQL on AWS, Railway, etc.)
2. **Configure environment variables** for production
3. **Run initial migration** on production database
4. **Set up monitoring** and alerting
5. **Implement backup strategy**
6. **Update API routes** to use Prisma helpers

## Migration from In-Memory Storage

The current API routes use in-memory storage. To migrate to Prisma:

1. Update API routes to use `DatabaseHelpers`
2. Replace in-memory arrays with database queries
3. Update authentication to use database users
4. Test all functionality with real database

Example migration:
```typescript
// Before (in-memory)
const orders = []

// After (Prisma)
const orders = await DatabaseHelpers.getRestaurantOrders(restaurantId)
```
