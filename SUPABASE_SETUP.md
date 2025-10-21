# MenuOS Supabase Integration Guide

## Overview

MenuOS now includes comprehensive Supabase integration, combining the power of Prisma ORM with Supabase's real-time features, authentication, and storage capabilities.

## What's Included

### 🔧 **Core Integration**
- **Supabase Client**: Full client and admin configurations
- **Hybrid Architecture**: Prisma for complex queries + Supabase for real-time
- **Authentication**: Supabase Auth integration
- **Storage**: File uploads for menu images and QR codes
- **Real-time**: Live order updates and status changes

### 📊 **Database Features**
- **PostgreSQL**: Full-featured database via Supabase
- **Real-time Subscriptions**: Live order updates
- **Row Level Security**: Data access controls
- **Analytics**: Real-time dashboard updates

### 🛠️ **Development Tools**
- **Setup Scripts**: Automated Supabase configuration
- **Test Scripts**: Integration testing
- **Helper Classes**: Simplified API operations
- **React Hooks**: Real-time data hooks

## Quick Start

### 1. Environment Setup

Copy and update your environment variables:
```bash
cp env.example .env.local
```

Update `.env.local` with your Supabase credentials:
```bash
# Database - Supabase
DATABASE_URL="postgresql://postgres:g8Ja7gvfJxLo6vg0@db.isletdfyulyiicpopcoq.supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://isletdfyulyiicpopcoq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbGV0ZGZ5dWx5aWljcG9wY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTg1MTUsImV4cCI6MjA3NjEzNDUxNX0.cYRyyf1oanH4ezfZJDfMKPh0KcQo57VwsADuywuMkaA"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

### 2. Database Setup

Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

### 3. Initialize Supabase

Run the setup script:
```bash
npm run supabase:setup
```

### 4. Test Integration

Verify everything is working:
```bash
npm run supabase:test
```

### 5. Seed Sample Data

Populate with test data:
```bash
npm run db:seed
```

## Architecture

### Hybrid Approach

MenuOS uses a hybrid architecture that combines the best of both worlds:

```typescript
// Complex queries and transactions → Prisma
const order = await DatabaseHelpers.createOrder(orderData)

// Real-time updates → Supabase
const subscription = SupabaseHelpers.subscribeToOrders(restaurantId, onUpdate)

// File uploads → Supabase Storage
const { url } = await SupabaseHelpers.uploadFile('menu-images', file)
```

### Data Flow

1. **Authentication**: Supabase Auth handles user sessions
2. **Data Storage**: Prisma manages complex database operations
3. **Real-time Updates**: Supabase subscriptions notify clients
4. **File Storage**: Supabase Storage handles images and files
5. **Analytics**: Real-time dashboard updates via Supabase

## Key Features

### 🔐 **Authentication**

```typescript
import { SupabaseIntegration } from '@/lib/supabase-integration'

// Sign up new user
const { user, error } = await SupabaseIntegration.authenticateUser(email, password)

// Get current user
const { user } = await supabase.auth.getUser()
```

### 📡 **Real-time Updates**

```typescript
import { useRealtimeOrders } from '@/lib/supabase-integration'

// React hook for real-time orders
const { orders, loading } = useRealtimeOrders(restaurantId)

// Subscribe to order status updates
const status = useRealtimeOrderStatus(orderId)
```

### 📁 **File Storage**

```typescript
import { SupabaseIntegration } from '@/lib/supabase-integration'

// Upload menu image
const { url } = await SupabaseIntegration.uploadMenuImage(
  file, 
  restaurantId, 
  menuItemId
)
```

### 📊 **Analytics**

```typescript
import { SupabaseIntegration } from '@/lib/supabase-integration'

// Real-time analytics updates
await SupabaseIntegration.updateAnalyticsRealtime(restaurantId, orderValue)
```

## API Integration

### SupabaseHelpers Class

```typescript
import { SupabaseHelpers } from '@/lib/supabase'

// Get restaurant orders with real-time updates
const { data, error } = await SupabaseHelpers.getRestaurantOrders(restaurantId)

// Update order status
await SupabaseHelpers.updateOrderStatus(orderId, 'READY')

// Subscribe to real-time updates
const subscription = SupabaseHelpers.subscribeToOrders(restaurantId, callback)
```

### SupabaseIntegration Class

```typescript
import { SupabaseIntegration } from '@/lib/supabase-integration'

// Create order with real-time notifications
const order = await SupabaseIntegration.createOrderWithRealtime(orderData, items)

// Health check
const health = await SupabaseIntegration.healthCheck()
```

## React Hooks

### useRealtimeOrders

```typescript
import { useRealtimeOrders } from '@/lib/supabase-integration'

function RestaurantDashboard({ restaurantId }) {
  const { orders, loading } = useRealtimeOrders(restaurantId)
  
  if (loading) return <div>Loading orders...</div>
  
  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
```

### useRealtimeOrderStatus

```typescript
import { useRealtimeOrderStatus } from '@/lib/supabase-integration'

function OrderStatus({ orderId }) {
  const status = useRealtimeOrderStatus(orderId)
  
  return <div>Order Status: {status}</div>
}
```

## Storage Buckets

The integration automatically sets up these storage buckets:

- **menu-images**: Restaurant menu item photos
- **restaurant-logos**: Restaurant branding images  
- **qr-codes**: Generated QR code images

### File Upload Example

```typescript
// Upload menu item image
const handleImageUpload = async (file: File, menuItemId: string) => {
  try {
    const { url } = await SupabaseIntegration.uploadMenuImage(
      file, 
      restaurantId, 
      menuItemId
    )
    
    // Update menu item with image URL
    await DatabaseHelpers.updateMenuItem(menuItemId, { image: url })
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

## Real-time Features

### Order Management

```typescript
// Restaurant receives new orders in real-time
const subscription = SupabaseIntegration.subscribeToRestaurantOrders(
  restaurantId,
  (newOrder) => {
    // Show notification
    showNotification(`New order: ${newOrder.orderNumber}`)
    
    // Update orders list
    setOrders(prev => [newOrder, ...prev])
  }
)
```

### Customer Order Tracking

```typescript
// Customer sees order status updates in real-time
const subscription = SupabaseIntegration.subscribeToOrderStatus(
  orderId,
  (status) => {
    setOrderStatus(status)
    
    if (status === 'READY') {
      showNotification('Your order is ready!')
    }
  }
)
```

## Available Scripts

```bash
# Supabase Management
npm run supabase:setup    # Initialize Supabase integration
npm run supabase:test     # Test all integrations

# Database Management  
npm run db:generate       # Generate Prisma client
npm run db:push          # Push schema to Supabase
npm run db:seed          # Populate with sample data
npm run db:studio        # Open Prisma Studio
npm run db:cleanup       # Clean up old data
```

## Production Deployment

### 1. Environment Variables

Set these in your production environment:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 2. Database Migration

```bash
# Deploy migrations to production
npm run db:migrate:deploy
```

### 3. Storage Setup

```bash
# Setup storage buckets
npm run supabase:setup
```

### 4. Row Level Security

Enable RLS policies in Supabase dashboard:
- Go to Authentication > Policies
- Enable RLS on all tables
- Create appropriate policies for data access

## Monitoring & Analytics

### Health Checks

```typescript
// Check system health
const health = await SupabaseIntegration.healthCheck()
console.log(health)
// {
//   prisma: { status: 'healthy' },
//   supabase: { status: 'healthy' },
//   overall: 'healthy'
// }
```

### Real-time Analytics

```typescript
// Analytics update automatically with each order
await SupabaseIntegration.updateAnalyticsRealtime(restaurantId, orderValue)

// View analytics in Supabase dashboard
// Go to Analytics > Reports
```

## Troubleshooting

### Common Issues

1. **Connection Errors**
   ```bash
   # Check environment variables
   echo $DATABASE_URL
   
   # Test connection
   npm run supabase:test
   ```

2. **Real-time Not Working**
   ```typescript
   // Check subscription status
   const subscription = SupabaseHelpers.subscribeToOrders(restaurantId, callback)
   console.log('Subscription active:', subscription.state)
   ```

3. **File Upload Issues**
   ```typescript
   // Check storage bucket permissions
   const { data, error } = await supabase.storage.listBuckets()
   console.log('Buckets:', data)
   ```

### Getting Help

- **Supabase Dashboard**: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq
- **Documentation**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions

## Next Steps

1. **Enable Authentication**: Set up Supabase Auth policies
2. **Configure Storage**: Set up file upload policies
3. **Real-time Features**: Implement live order updates
4. **Analytics**: Set up real-time dashboard
5. **Testing**: Run integration tests
6. **Deployment**: Deploy to production

## Migration from In-Memory

To migrate existing API routes to use Supabase:

```typescript
// Before (in-memory)
const orders = []

// After (Supabase + Prisma)
const orders = await SupabaseHelpers.getRestaurantOrders(restaurantId)
```

The integration provides a seamless upgrade path while maintaining all existing functionality and adding powerful real-time capabilities.
