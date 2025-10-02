# MenuPRO App Deployment Guide

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [next.config.js](file://next.config.js)
- [SEO_STRATEGY.md](file://SEO_STRATEGY.md)
- [src/app/sitemap.ts](file://src/app/sitemap.ts)
- [src/app/robots.ts](file://src/app/robots.ts)
- [src/app/layout.tsx](file://src/app/layout.tsx)
- [EMAIL_SETUP.md](file://EMAIL_SETUP.md)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts)
- [src/app/api/restaurant/verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts)
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Building the Application](#building-the-application)
5. [Deployment Options](#deployment-options)
6. [Static vs Server-Side Rendering](#static-vs-server-side-rendering)
7. [API Route Deployment](#api-route-deployment)
8. [Domain Configuration](#domain-configuration)
9. [SEO Optimization](#seo-optimization)
10. [Post-Deployment Verification](#post-deployment-verification)
11. [Monitoring and Maintenance](#monitoring-and-maintenance)
12. [Common Deployment Issues](#common-deployment-issues)
13. [Performance Tuning](#performance-tuning)
14. [Rollback Procedures](#rollback-procedures)
15. [Conclusion](#conclusion)

## Introduction

MenuPRO is a modern restaurant menu management and ordering system built with Next.js 14, TypeScript, and Tailwind CSS. This comprehensive deployment guide covers the complete process of deploying MenuPRO to production environments, including static export capabilities, API route deployment, and SEO optimization strategies.

The application features a sophisticated PWA experience with QR code scanning, interactive menu browsing, shopping cart functionality, and order customization. It's designed to compete with established restaurant management platforms like Square and Toast while offering significant cost savings and simplified setup.

## Prerequisites

Before deploying MenuPRO, ensure you have the following prerequisites:

### Development Environment
- **Node.js 18+** installed on your local machine
- **npm** or **yarn** package manager
- **Git** for version control
- **Text editor** or IDE (VS Code recommended)

### Production Environment
- **Node.js 18+** runtime environment
- **Production-ready database** (PostgreSQL, MongoDB, or Redis for session storage)
- **Email service provider** (Gmail, SendGrid, or AWS SES)
- **SSL/TLS certificate** for HTTPS
- **Domain name** with DNS configuration

### Required Tools
- **Docker** (optional but recommended for containerized deployments)
- **CI/CD pipeline tools** (GitHub Actions, GitLab CI, etc.)
- **Monitoring tools** (New Relic, Datadog, etc.)
- **Load balancer** (optional for high-traffic deployments)

## Environment Configuration

### Creating Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# JWT Secret (use a strong secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret

# Database Configuration (for production)
DATABASE_URL=postgresql://username:password@host:port/database

# Redis Configuration (for production)
REDIS_URL=redis://localhost:6379

# Base URL for production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Production Environment Variables

For production deployments, configure the following additional environment variables:

```bash
# Email Provider Configuration
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@provider.com
SMTP_PASS=your-email-password

# Session Storage (Redis)
SESSION_STORE=redis

# Logging Configuration
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# Analytics Configuration
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Section sources**
- [EMAIL_SETUP.md](file://EMAIL_SETUP.md#L1-L67)

## Building the Application

### Standard Build Process

The application uses Next.js 14's App Router architecture and requires a production build before deployment:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm run start
```

### Build Output Analysis

After running `npm run build`, Next.js generates the following artifacts:

- **`.next/`**: Compiled application files
- **`out/`**: Static export files (if configured)
- **`public/`**: Static assets
- **`pages/`**: Server-side rendered pages
- **`api/`**: API routes

### Build Configuration

The `next.config.js` file contains essential build configurations:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true, // For static exports if needed
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
```

### Static Export Configuration

For static hosting platforms, configure static export:

```javascript
const nextConfig = {
  output: 'export', // Enable static export
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Optional for clean URLs
}
```

**Section sources**
- [package.json](file://package.json#L1-L89)
- [next.config.js](file://next.config.js#L1-L16)

## Deployment Options

### Vercel Deployment

Vercel is the recommended deployment platform for Next.js applications:

1. **Connect GitHub Repository**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/menupro.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Sign up at vercel.com
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Set build command to `npm run build`
   - Set output directory to `.next`

3. **Vercel Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   ```

### Netlify Deployment

Netlify is another excellent option for static hosting:

1. **Install Netlify CLI**
   ```bash
   npm install netlify-cli -g
   ```

2. **Configure Netlify**
   ```toml
   # netlify.toml
   [build]
     publish = ".next"
     command = "npm run build"
     
   [build.environment]
     NODE_VERSION = "18"
     
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Self-Hosted Deployment

For self-hosted deployments, use one of the following approaches:

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000
CMD ["npm", "run", "start"]
```

#### PM2 Process Manager

```bash
# Install PM2 globally
npm install pm2 -g

# Start application with PM2
pm2 start npm --name "menupro" -- start

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

#### Nginx Reverse Proxy

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Static vs Server-Side Rendering

### Understanding Rendering Modes

MenuPRO supports multiple rendering modes depending on deployment requirements:

#### Static Generation (SSG)
- **Best for**: Marketing pages, blog posts, product pages
- **Advantages**: Fastest load times, CDN friendly, zero server costs
- **Limitations**: Cannot serve dynamic content

#### Server-Side Rendering (SSR)
- **Best for**: User-specific content, API routes, dynamic pages
- **Advantages**: Fresh content, better SEO, real-time data
- **Limitations**: Higher server costs, slower initial load

#### Incremental Static Regeneration (ISR)
- **Best for**: Hybrid approach with fresh content
- **Advantages**: Balances performance and freshness
- **Limitations**: Requires background regeneration

### Rendering Mode Selection

```mermaid
flowchart TD
A["Page Type"] --> B{"Marketing Pages"}
A --> C{"Dynamic Content"}
A --> D{"API Routes"}
B --> E["Static Generation<br/>Fastest Performance"]
C --> F["Server-Side Rendering<br/>Fresh Content"]
D --> G["API Routes<br/>Serverless Functions"]
E --> H["CDN Distribution<br/>Zero Server Costs"]
F --> I["Real-Time Updates<br/>Database Integration"]
G --> J["Scalable Backend<br/>Auto Scaling"]
```

### Implementation Example

```typescript
// src/app/page.tsx
export default function HomePage() {
  return (
    <div>
      {/* Static content */}
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

// API route for dynamic content
export async function GET() {
  const data = await fetchDynamicContent();
  return NextResponse.json(data);
}
```

## API Route Deployment

### API Route Architecture

MenuPRO includes several API routes for authentication, order management, and QR code generation:

```mermaid
sequenceDiagram
participant Client as "PWA Client"
participant Auth as "Auth API"
participant Orders as "Orders API"
participant QR as "QR API"
participant Email as "Email Service"
Client->>Auth : POST /api/auth/send-verification
Auth->>Email : Send OTP Email
Email-->>Auth : Confirmation
Auth-->>Client : Verification Sent
Client->>Auth : POST /api/auth/verify-otp
Auth->>Auth : Validate OTP
Auth-->>Client : JWT Token
Client->>Orders : POST /api/orders/create
Orders->>Orders : Process Order
Orders-->>Client : Order Created
Client->>QR : POST /api/restaurant/generate-qr
QR->>QR : Generate QR Code
QR-->>Client : QR Data URL
```

**Diagram sources**
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L55)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L1-L161)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L48)

### API Route Security

All API routes implement JWT-based authentication:

```typescript
// Authentication middleware
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Authorization token required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    // Proceed with API logic
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
```

### Production API Configuration

For production deployments, configure the following:

```bash
# API Rate Limiting
RATE_LIMIT_WINDOW=60
RATE_LIMIT_MAX_REQUESTS=100

# API CORS Configuration
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# API Logging
API_LOG_LEVEL=info
API_LOG_FORMAT=json
```

**Section sources**
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L55)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L1-L161)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L48)

## Domain Configuration

### DNS Configuration

Configure your domain with the following DNS records:

```dns
# A Record for primary domain
menupro.app.    IN  A     192.0.2.1

# CNAME for www subdomain
www.menupro.app. IN  CNAME  menupro.app.

# MX Records for email
menupro.app.    IN  MX  10 mail.menupro.app.

# TXT Records for email verification
menupro.app.    IN  TXT   "v=spf1 include:_spf.google.com ~all"
```

### SSL Certificate Setup

```bash
# Using Certbot for Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d menupro.app -d www.menupro.app

# Automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Domain Redirects

Configure redirects for SEO and user convenience:

```nginx
# Redirect www to non-www
server {
    server_name www.menupro.app;
    return 301 https://menupro.app$request_uri;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name menupro.app;
    return 301 https://menupro.app$request_uri;
}
```

## SEO Optimization

### Sitemap Configuration

MenuPRO automatically generates a comprehensive sitemap:

```typescript
// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://menupro.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Additional pages...
  ]
}
```

### Robots.txt Configuration

Configure robots.txt for optimal crawling:

```typescript
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/restaurant-dashboard/'],
    },
    sitemap: 'https://menupro.app/sitemap.xml',
  }
}
```

### Metadata Optimization

The layout component includes comprehensive SEO metadata:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: 'MenuPRO - #1 Restaurant CMS & Digital Menu System | Better Than Square & Toast',
  description: 'The best restaurant CMS for digital menus and QR ordering. No commission fees, $19/month flat rate. Better than Square ($69+/month) and Toast ($79+/month). Setup in 15 minutes.',
  keywords: 'restaurant CMS, digital menu system, QR code ordering, restaurant management software, restaurant POS alternative',
  openGraph: {
    type: 'website',
    url: 'https://menupro.app',
    title: 'MenuPRO - #1 Restaurant CMS | Better Than Square & Toast | $19/month',
    description: 'The best restaurant CMS for digital menus and QR ordering. No commission fees, $19/month flat rate.',
    images: [{
      url: '/menupro-logo.png',
      width: 1200,
      height: 630,
      alt: 'MenuPRO Restaurant CMS - Better Than Square and Toast',
    }],
  },
}
```

### SEO Strategy Implementation

Follow the comprehensive SEO strategy outlined in `SEO_STRATEGY.md`:

1. **Keyword Targeting**: Focus on high-volume keywords like "restaurant CMS" and "digital menu system"
2. **Content Pillars**: Create comparison content, feature-focused guides, and problem-solving articles
3. **Technical SEO**: Optimize Core Web Vitals, mobile-first design, and page speed
4. **Link Building**: Target industry publications and guest posting opportunities

**Section sources**
- [src/app/sitemap.ts](file://src/app/sitemap.ts#L1-L129)
- [src/app/robots.ts](file://src/app/robots.ts#L1-L13)
- [src/app/layout.tsx](file://src/app/layout.tsx#L1-L70)
- [SEO_STRATEGY.md](file://SEO_STRATEGY.md#L1-L217)

## Post-Deployment Verification

### Health Check Endpoint

Create a health check endpoint to monitor application status:

```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // Check database connectivity
    const dbStatus = await checkDatabaseConnection();
    
    // Check external services
    const emailStatus = await checkEmailService();
    const redisStatus = await checkRedisConnection();
    
    const isHealthy = dbStatus && emailStatus && redisStatus;
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      dependencies: {
        database: dbStatus,
        email: emailStatus,
        cache: redisStatus
      }
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```

### Automated Testing

Set up automated testing for post-deployment verification:

```bash
# Test API endpoints
curl -X POST https://your-domain.com/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test PWA functionality
curl https://your-domain.com/manifest.json

# Test SEO configuration
curl https://your-domain.com/sitemap.xml
curl https://your-domain.com/robots.txt
```

### Monitoring Checks

Verify the following components:

1. **Application Health**
   - API endpoints responding correctly
   - Database connections established
   - Email service operational
   - File uploads working

2. **Performance Metrics**
   - Page load times under 3 seconds
   - Core Web Vitals scores
   - Mobile responsiveness
   - Image optimization

3. **Security Headers**
   - HTTPS enforced
   - Content Security Policy
   - XSS protection
   - CSRF protection

## Monitoring and Maintenance

### Application Monitoring

Set up comprehensive monitoring for production:

```yaml
# docker-compose.yml for monitoring stack
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      
  loki:
    image: grafana/loki
    ports:
      - "3100:3100"
```

### Log Management

Configure centralized logging:

```bash
# Elasticsearch, Logstash, Kibana (ELK) stack
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  docker.elastic.co/elasticsearch/elasticsearch:7.15.0

# Log aggregation
npm install winston express-winston
```

### Performance Monitoring

Monitor key performance indicators:

```typescript
// Performance monitoring middleware
export function performanceMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const metrics = {
      url: req.url,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString()
    };
    
    // Log to monitoring system
    logPerformanceMetrics(metrics);
  });
  
  next();
}
```

### Backup Strategy

Implement automated backups:

```bash
#!/bin/bash
# backup.sh

# Database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Application files backup
tar -czf app-backup-$(date +%Y%m%d-%H%M%S).tar.gz /var/www/menupro

# Upload to cloud storage
aws s3 cp backup-*.sql s3://your-backup-bucket/
aws s3 cp app-backup-*.tar.gz s3://your-backup-bucket/

# Cleanup old backups
find /tmp -name "*.sql" -mtime +7 -delete
find /tmp -name "*.tar.gz" -mtime +30 -delete
```

## Common Deployment Issues

### Build Failures

**Issue**: TypeScript compilation errors during build
```bash
# Solution: Check TypeScript configuration
npx tsc --noEmit
```

**Issue**: Memory allocation errors
```bash
# Solution: Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Runtime Errors

**Issue**: JWT token validation failures
```typescript
// Debug JWT token issues
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Token:', token);
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Decoded token:', decoded);
} catch (error) {
  console.error('JWT verification failed:', error.message);
}
```

**Issue**: Database connection timeouts
```typescript
// Implement connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### API Route Issues

**Issue**: CORS policy violations
```typescript
// Configure CORS properly
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

**Issue**: Rate limiting bypassed
```typescript
// Implement proper rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});
```

### Performance Issues

**Issue**: Slow API response times
```typescript
// Optimize database queries
const optimizedQuery = `
  SELECT id, name, price 
  FROM menu_items 
  WHERE restaurant_id = $1 
  ORDER BY category, name
`;

// Implement caching
const cacheKey = `menu:${restaurantId}`;
const cachedMenu = await redis.get(cacheKey);
if (cachedMenu) {
  return JSON.parse(cachedMenu);
}
```

## Performance Tuning

### Frontend Optimization

Optimize the client-side performance:

```typescript
// Image optimization
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true}
/>

// Lazy loading for non-critical resources
const LazyComponent = dynamic(() => import('./expensive-component'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// Code splitting
const DynamicImport = dynamic(() => import('./heavy-module'));
```

### Backend Optimization

Optimize server-side performance:

```typescript
// Database optimization
export async function GET() {
  // Use indexes effectively
  const result = await db.query(`
    SELECT * FROM orders 
    WHERE restaurant_id = $1 
    AND created_at > NOW() - INTERVAL '1 day'
    ORDER BY created_at DESC
    LIMIT 50
  `);
  
  // Implement connection pooling
  const pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}
```

### Caching Strategy

Implement multi-level caching:

```typescript
// Redis caching
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

await redis.connect();

// Cache API responses
export async function GET() {
  const cacheKey = 'api:orders:latest';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }
  
  const data = await fetchOrders();
  await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 minute TTL
  
  return NextResponse.json(data);
}
```

### CDN Configuration

Configure CDN for global distribution:

```nginx
# nginx.conf
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
    gzip_static on;
}

location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_cache my_cache;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;
}
```

## Rollback Procedures

### Automated Rollback

Implement automated rollback mechanisms:

```bash
#!/bin/bash
# rollback.sh

# Get current version
CURRENT_VERSION=$(git rev-parse HEAD)

# Deploy previous version
git checkout $(git log --pretty=format:'%H' -n 2 | tail -n 1)
npm install
npm run build
npm run start

# Test deployment
curl -f https://your-domain.com/api/health || {
  echo "Rollback failed"
  exit 1
}

echo "Rollback successful"
```

### Manual Rollback Process

1. **Stop Current Deployment**
   ```bash
   # Stop current process
   pm2 stop menupro
   
   # Remove current build
   rm -rf .next
   ```

2. **Restore Previous Version**
   ```bash
   # Checkout previous release
   git checkout v1.0.0
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start application
   pm2 start npm --name "menupro" -- start
   ```

3. **Verify Rollback**
   ```bash
   # Health check
   curl https://your-domain.com/api/health
   
   # Monitor logs
   pm2 logs menupro
   ```

### Database Rollback

For database changes, implement migration rollback:

```sql
-- Migration rollback example
BEGIN;

-- Undo changes from migration
ALTER TABLE orders DROP COLUMN IF EXISTS new_column;

-- Update schema version
UPDATE migrations SET version = version - 1 WHERE id = current_migration_id;

COMMIT;
```

### Communication Plan

Establish communication protocols for rollbacks:

```markdown
# Emergency Rollback Checklist

## Immediate Actions
- [ ] Notify team via Slack/Discord
- [ ] Update status page
- [ ] Rollback deployment
- [ ] Verify rollback success

## Communication Template
Subject: Emergency Rollback - [Issue Description]

Dear Users,

We've encountered an issue with our latest deployment and are rolling back to the previous stable version. We apologize for any inconvenience this may cause.

Current Status: [Rollback Complete/In Progress]
Expected Resolution: [Time Estimate]
Impact: [Brief Description]

Our team is working to resolve the issue and will provide updates as we progress.

Thank you for your patience.
```

## Conclusion

This comprehensive deployment guide provides everything needed to successfully deploy MenuPRO to production environments. Key takeaways include:

### Deployment Best Practices
- Use environment-specific configurations for different stages
- Implement comprehensive monitoring and logging
- Establish automated testing and rollback procedures
- Optimize both frontend and backend performance

### SEO and Marketing
- Leverage the comprehensive SEO strategy outlined in `SEO_STRATEGY.md`
- Implement structured data and schema markup
- Create high-quality content around target keywords
- Build relationships with industry publications

### Ongoing Maintenance
- Regularly update dependencies and security patches
- Monitor performance metrics and user feedback
- Continuously optimize for conversion rates
- Stay updated with Next.js framework improvements

### Success Metrics
- Achieve target keyword rankings within 6-12 months
- Generate 50+ qualified leads per month from organic traffic
- Maintain 99.9% uptime with proper monitoring
- Deliver exceptional user experience with fast load times

By following this guide, you'll be able to deploy MenuPRO successfully while maintaining high performance, reliability, and SEO optimization. Regular monitoring and continuous improvement will ensure long-term success against competitors like Square and Toast.