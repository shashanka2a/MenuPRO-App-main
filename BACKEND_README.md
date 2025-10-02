# MenuPRO Backend Implementation

A comprehensive backend system for MenuPRO with multi-tenant architecture, secure authentication, and advanced features including menu parsing, QR code generation, and order management.

## 🚀 Features Implemented

### ✅ Core Infrastructure
- **Prisma Schema** with 9 models (User, Restaurant, Membership, Table, MenuVersion, MenuItem, Order, OrderItem, AuditLog)
- **Multi-tenant Architecture** with automatic tenant isolation
- **Supabase Integration** for authentication and storage
- **Row Level Security (RLS)** policies for data protection

### ✅ Middleware & Security
- **Tenant Isolation Middleware** - Auto-inject restaurantId into queries
- **Audit Logging Middleware** - Track all database changes with before/after states
- **Idempotency Middleware** - Prevent duplicate operations (Orders, Payments)
- **Authentication Integration** - JWT with restaurant context and role-based access

### ✅ APIs Implemented
- **Order Management API** (`/api/orders/*`) - Create, read, update orders with atomic transactions
- **Menu Parsing Pipeline** (`/api/restaurant/parse-menu`) - OCR + AI menu processing
- **QR Code Service** (`/api/restaurant/generate-qr`) - Per-table QR code generation
- **Health & Metrics** (`/api/health`, `/api/metrics`) - System monitoring

### ✅ Advanced Features
- **Version Control** - Optimistic concurrency for MenuVersion & Order
- **File Upload** - PDF/image menu parsing with Tesseract OCR
- **Performance Monitoring** - Query performance tracking with Sentry integration
- **Comprehensive Logging** - Winston logger with structured logging

## 📁 Project Structure

```
src/
├── lib/
│   ├── prisma-tenant.ts      # Tenant-aware Prisma client with middleware
│   ├── audit-middleware.ts   # Audit logging for all operations
│   ├── idempotency-middleware.ts # Idempotency for critical operations
│   ├── supabase-auth.ts      # Authentication service with JWT
│   ├── menu-parser.ts        # OCR + AI menu parsing pipeline
│   ├── qr-service.ts         # QR code generation and management
│   └── monitoring.ts         # Performance monitoring and alerting
├── app/api/
│   ├── orders/
│   │   ├── route.ts          # GET /api/orders (list orders)
│   │   ├── create/route.ts   # POST /api/orders/create
│   │   └── [id]/route.ts     # GET/PATCH /api/orders/:id
│   ├── restaurant/
│   │   ├── parse-menu/route.ts    # POST /api/restaurant/parse-menu
│   │   └── generate-qr/route.ts   # POST /api/restaurant/generate-qr
│   ├── health/route.ts       # GET /api/health
│   └── metrics/route.ts      # GET /api/metrics
└── prisma/
    ├── schema.prisma         # Complete database schema
    └── rls-policies.sql      # Supabase RLS policies
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for custom JWT signing

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# OR run migrations (for production)
npm run db:migrate
```

### 3. Supabase Setup

1. **Create Storage Buckets:**
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('menu-uploads', 'menu-uploads', true),
   ('qr-codes', 'qr-codes', true);
   ```

2. **Apply RLS Policies:**
   ```bash
   # Run the SQL from prisma/rls-policies.sql in Supabase SQL Editor
   ```

### 4. Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Check database
npm run db:studio
```

## 📚 API Documentation

### Authentication
All API routes (except health check) require Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

### Order Management

#### Create Order
```http
POST /api/orders/create
Content-Type: application/json

{
  "tableId": "table_id",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "items": [
    {
      "menuItemId": "item_id",
      "quantity": 2,
      "specialRequests": "No onions"
    }
  ],
  "requestId": "unique_request_id" // For idempotency
}
```

#### List Orders
```http
GET /api/orders?page=1&limit=20&status=PENDING&fromDate=2024-01-01
```

#### Update Order Status
```http
PATCH /api/orders/{orderId}
Content-Type: application/json

{
  "status": "CONFIRMED",
  "version": 1, // For optimistic concurrency
  "estimatedTime": 25
}
```

### Menu Parsing

#### Parse Menu from File
```http
POST /api/restaurant/parse-menu
Content-Type: multipart/form-data

file: <pdf/image file>
versionName: "Summer Menu 2024"
makeActive: true
```

### QR Code Generation

#### Generate QR Codes
```http
POST /api/restaurant/generate-qr
Content-Type: application/json

{
  "tableIds": ["table1", "table2"], // Optional: specific tables
  "regenerate": false,              // Regenerate existing codes
  "options": {
    "size": 300,
    "color": {
      "dark": "#000000",
      "light": "#FFFFFF"
    }
  }
}
```

### System Monitoring

#### Health Check
```http
GET /api/health
```

#### Metrics (Admin only)
```http
GET /api/metrics
```

## 🏗️ Architecture Features

### Multi-Tenant Isolation
- Automatic `restaurantId` injection in all queries
- JWT-based tenant context
- Role-based access control (CUSTOMER, STAFF, MANAGER, ADMIN, OWNER)

### Audit Logging
- Captures before/after state for all changes
- Tracks user actions with IP and user agent
- Sanitizes sensitive data automatically

### Idempotency
- Request ID-based duplicate prevention
- Critical for order creation and payments
- Distributed locking support (Redis-ready)

### Performance Monitoring
- Query performance tracking
- Error rate monitoring
- Sentry integration for error tracking
- Health check endpoints

## 🔐 Security Features

### Row Level Security (RLS)
- Database-level access control
- Supabase RLS policies for all tables
- Tenant isolation at DB level

### Authentication
- Supabase Auth integration
- Custom JWT with restaurant context
- OTP-based authentication (email/SMS)

### Data Protection
- Sensitive field masking in audit logs
- Encrypted tokens and passwords
- CORS protection and rate limiting ready

## 📊 Monitoring & Observability

### Metrics Tracked
- Orders per minute
- Failed OTP attempts
- Menu parsing latency
- Error rates and response times
- Active user count

### Alerting Thresholds
- Error rate > 5%
- Response time > 2000ms
- Failed OTPs > 10 per hour
- Menu parsing > 30s

### Logging
- Structured JSON logging with Winston
- Query performance logging
- Request/response logging
- Error tracking with stack traces

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Production Deployment

### Environment Variables
Set production values for:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `SENTRY_DSN` (for error tracking)
- `REDIS_URL` (for caching/idempotency)

### Database Migration
```bash
# Run migrations in production
npm run db:migrate
```

### Monitoring Setup
- Configure Sentry for error tracking
- Set up log aggregation
- Monitor health check endpoint
- Set up alerting for key metrics

## 📝 Notes

### Prisma Middleware Stack
1. **Tenant Isolation** - Auto-inject restaurantId
2. **Access Control** - Role-based validation
3. **Audit Logging** - Track all changes
4. **Idempotency** - Prevent duplicates
5. **Performance** - Monitor query performance

### Menu Parsing Pipeline
1. **File Upload** - Supabase Storage
2. **OCR Processing** - Tesseract.js
3. **AI Enhancement** - OpenAI integration (optional)
4. **Data Extraction** - Pattern matching + ML
5. **Database Storage** - Atomic transactions

### QR Code System
1. **Unique Generation** - Per-table QR codes
2. **Storage** - Supabase Storage with CDN
3. **URL Generation** - Restaurant slug + table context
4. **Analytics** - Scan tracking (extensible)

This implementation provides a production-ready backend with enterprise-grade features for multi-tenant restaurant management.