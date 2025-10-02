# MenuPRO API Reference

<cite>
**Referenced Files in This Document**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts)
- [src/app/api/restaurant/send-verification/route.ts](file://src/app/api/restaurant/send-verification/route.ts)
- [src/app/api/restaurant/verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts)
- [package.json](file://package.json)
- [README.md](file://README.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Customer Endpoints](#customer-endpoints)
4. [Restaurant Endpoints](#restaurant-endpoints)
5. [Error Codes](#error-codes)
6. [Rate Limiting](#rate-limiting)
7. [Versioning](#versioning)
8. [Security Best Practices](#security-best-practices)
9. [Client Implementation Guidelines](#client-implementation-guidelines)

## Introduction

MenuPRO is a modern restaurant menu management and ordering system built with Next.js 14, TypeScript, and Tailwind CSS. The API provides comprehensive endpoints for customer ordering, restaurant management, and authentication workflows.

### API Overview
- **Base URL**: `/api`
- **Content Type**: `application/json`
- **Authentication**: JWT tokens for customer and restaurant sessions
- **CORS**: Enabled for cross-origin requests
- **HTTPS**: Required for production environments

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authentication**: JSON Web Tokens (JWT)
- **Email Service**: Nodemailer with Gmail SMTP
- **OCR**: Tesseract.js for menu parsing
- **QR Generation**: qrcode library

## Authentication

MenuPRO implements a two-tier authentication system for customers and restaurants, utilizing email verification with OTP (One-Time Password) and JWT tokens.

### Customer Authentication Flow

```mermaid
sequenceDiagram
participant Client as "Mobile/Web Client"
participant API as "MenuPRO API"
participant Email as "Email Service"
participant JWT as "JWT Provider"
Client->>API : POST /api/auth/send-verification
API->>Email : Send OTP Email
Email-->>API : Confirmation
API-->>Client : Success Response
Client->>API : POST /api/auth/verify-otp
API->>API : Validate OTP & Expiry
API->>JWT : Generate Access Token
JWT-->>API : JWT Token
API-->>Client : Token + User Info
```

### Restaurant Authentication Flow

```mermaid
sequenceDiagram
participant Restaurant as "Restaurant App"
participant API as "MenuPRO API"
participant Email as "Email Service"
participant JWT as "JWT Provider"
Restaurant->>API : POST /api/restaurant/send-verification
API->>Email : Send OTP Email
Email-->>API : Confirmation
API-->>Restaurant : Success Response
Restaurant->>API : POST /api/restaurant/verify-otp
API->>API : Validate OTP & Expiry
API->>JWT : Generate Restaurant Token
JWT-->>API : JWT Token
API-->>Restaurant : Token + Restaurant Info
```

**Diagram sources**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts#L1-L98)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L78)
- [src/app/api/restaurant/send-verification/route.ts](file://src/app/api/restaurant/send-verification/route.ts#L1-L99)
- [src/app/api/restaurant/verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts#L1-L83)

**Section sources**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts#L1-L98)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L78)
- [src/app/api/restaurant/send-verification/route.ts](file://src/app/api/restaurant/send-verification/route.ts#L1-L99)
- [src/app/api/restaurant/verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts#L1-L83)

## Customer Endpoints

### POST /api/auth/send-verification

Sends a verification OTP to the provided email address for customer authentication.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Response Format:**
```json
{
  "message": "Verification email sent successfully"
}
```

**Status Codes:**
- `200 OK`: Email sent successfully
- `400 Bad Request`: Email is required
- `500 Internal Server Error`: Failed to send email

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com"}'
```

### POST /api/auth/verify-otp

Verifies the OTP sent to the customer's email and returns a JWT access token.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "otp": "123456"
}
```

**Response Format:**
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "customer@example.com",
    "verified": true
  }
}
```

**Status Codes:**
- `200 OK`: OTP verified successfully
- `400 Bad Request`: Invalid or expired OTP
- `500 Internal Server Error`: Verification failed

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "otp": "123456"}'
```

### POST /api/orders/create

Creates a new order for the authenticated customer.

**Request Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "items": [
    {
      "id": "menu-item-123",
      "name": "Grilled Salmon",
      "price": 18.99,
      "quantity": 1,
      "selectedOptions": {
        "size": "Medium",
        "customizations": ["Extra sauce", "No onions"]
      }
    }
  ]
}
```

**Response Format:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "ORD123ABC",
    "total": 18.99,
    "estimatedTime": "9 minutes",
    "status": "pending"
  }
}
```

**Status Codes:**
- `201 Created`: Order created successfully
- `400 Bad Request`: Invalid order items
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Failed to create order

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/orders/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "items": [
      {
        "id": "menu-item-123",
        "name": "Grilled Salmon",
        "price": 18.99,
        "quantity": 1
      }
    ]
  }'
```

### GET /api/orders

Retrieves all orders for the authenticated customer.

**Request Headers:**
- `Authorization: Bearer <jwt_token>`

**Response Format:**
```json
{
  "orders": [
    {
      "id": "ORD123ABC",
      "email": "customer@example.com",
      "items": [...],
      "total": 18.99,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "estimatedTime": "9 minutes"
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Orders retrieved successfully
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Failed to retrieve orders

**cURL Example:**
```bash
curl -X GET https://menupro.app/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Section sources**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts#L1-L98)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L78)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L1-L161)

## Restaurant Endpoints

### POST /api/restaurant/send-verification

Sends a verification OTP to the restaurant's email address for account registration.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "restaurant@example.com"
}
```

**Response Format:**
```json
{
  "message": "Verification email sent successfully"
}
```

**Status Codes:**
- `200 OK`: Email sent successfully
- `400 Bad Request`: Email is required
- `500 Internal Server Error`: Failed to send email

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/restaurant/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "restaurant@example.com"}'
```

### POST /api/restaurant/verify-otp

Verifies the OTP sent to the restaurant's email and returns a JWT access token for restaurant operations.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "restaurant@example.com",
  "otp": "654321"
}
```

**Response Format:**
```json
{
  "message": "Restaurant account verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "restaurant@example.com",
    "type": "restaurant",
    "verified": true
  }
}
```

**Status Codes:**
- `200 OK`: OTP verified successfully
- `400 Bad Request`: Invalid or expired OTP
- `500 Internal Server Error`: Verification failed

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/restaurant/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "restaurant@example.com", "otp": "654321"}'
```

### POST /api/restaurant/generate-qr

Generates a QR code for a specific restaurant table.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "restaurantId": "rest-123",
  "tableNumber": "5"
}
```

**Response Format:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "https://menupro.app/order?restaurant=rest-123&table=5",
  "tableNumber": "5",
  "restaurantId": "rest-123"
}
```

**Status Codes:**
- `200 OK`: QR code generated successfully
- `400 Bad Request`: Restaurant ID and table number are required
- `500 Internal Server Error`: Failed to generate QR code

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/restaurant/generate-qr \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "rest-123",
    "tableNumber": "5"
  }'
```

### PUT /api/restaurant/generate-qr (Bulk)

Generates QR codes for multiple restaurant tables in bulk.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "restaurantId": "rest-123",
  "numberOfTables": 10
}
```

**Response Format:**
```json
{
  "success": true,
  "qrCodes": [
    {
      "tableNumber": "1",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://menupro.app/order?restaurant=rest-123&table=1"
    },
    {
      "tableNumber": "2",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://menupro.app/order?restaurant=rest-123&table=2"
    }
  ],
  "totalTables": 10
}
```

**Status Codes:**
- `200 OK`: QR codes generated successfully
- `400 Bad Request`: Restaurant ID and number of tables are required
- `500 Internal Server Error`: Failed to generate QR codes

**cURL Example:**
```bash
curl -X PUT https://menupro.app/api/restaurant/generate-qr \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "rest-123",
    "numberOfTables": 10
  }'
```

### POST /api/restaurant/parse-menu

Parses menu items from uploaded PDF or image files using OCR technology.

**Request Headers:**
- `Content-Type: multipart/form-data`

**Request Body:**
- `file`: Menu file (PDF or image)
- `method`: Parsing method (`pdf` or `physical`)

**Response Format:**
```json
{
  "success": true,
  "items": [
    {
      "name": "Classic Cheeseburger",
      "price": 8.99,
      "description": "Beef patty, cheese, lettuce, tomato, pickles",
      "category": "Burgers",
      "confidence": 0.85
    }
  ],
  "extractedText": "Menu Item 1: Classic Cheeseburger $8.99 Description..."
}
```

**Status Codes:**
- `200 OK`: Menu parsed successfully
- `400 Bad Request`: No file provided
- `500 Internal Server Error`: Failed to parse menu

**cURL Example:**
```bash
curl -X POST https://menupro.app/api/restaurant/parse-menu \
  -F "file=@menu.pdf" \
  -F "method=pdf" \
  -H "Content-Type: multipart/form-data"
```

**Section sources**
- [src/app/api/restaurant/send-verification/route.ts](file://src/app/api/restaurant/send-verification/route.ts#L1-L99)
- [src/app/api/restaurant/verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts#L1-L83)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L98)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L1-L152)

## Error Codes

### Standard HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### MenuPRO Specific Error Responses

**Authentication Errors:**
```json
{
  "message": "Authorization token required"
}
```

**Validation Errors:**
```json
{
  "message": "Email is required"
}
```

**Verification Errors:**
```json
{
  "message": "Verification code has expired. Please request a new one."
}
```

**Business Logic Errors:**
```json
{
  "message": "Invalid verification code"
}
```

## Rate Limiting

### Current Implementation

The API currently implements basic rate limiting through OTP expiration and cleanup mechanisms:

- **OTP Expiration**: 10 minutes for all verification codes
- **Cleanup Interval**: Every 5 minutes for expired OTPs
- **Token Expiration**: 
  - Customer tokens: 24 hours
  - Restaurant tokens: 7 days

### Recommended Rate Limits

For production deployment, implement the following rate limits:

| Endpoint | Rate Limit | Window | Reason |
|----------|------------|--------|---------|
| `/api/auth/send-verification` | 5 requests/hour | Per IP address | Prevent abuse |
| `/api/auth/verify-otp` | 10 requests/hour | Per email | Prevent brute force |
| `/api/orders/create` | 100 requests/day | Per authenticated user | Prevent spam orders |
| `/api/restaurant/send-verification` | 3 requests/hour | Per IP address | Prevent abuse |
| `/api/restaurant/verify-otp` | 5 requests/hour | Per email | Prevent brute force |
| `/api/restaurant/generate-qr` | 1000 requests/day | Per authenticated user | Prevent resource exhaustion |

### Rate Limit Headers

Expected response headers for rate limiting:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
Retry-After: 3600
```

## Versioning

### Current Version

The API is currently unversioned, operating under a single version specification.

### Versioning Strategy

Recommended versioning approach:

- **URL Path Versioning**: `/api/v1/<endpoint>`
- **Accept Header Versioning**: `Accept: application/vnd.menupro.v1+json`
- **Deprecation Policy**: 90-day notice for breaking changes

### Version History

| Version | Changes | Deprecated Endpoints | New Endpoints |
|---------|---------|---------------------|---------------|
| v1.0 | Initial release | None | All current endpoints |
| v1.1 | Added bulk QR generation | None | PUT /api/restaurant/generate-qr |
| v1.2 | Enhanced menu parsing | None | POST /api/restaurant/parse-menu |

## Security Best Practices

### Authentication Security

1. **JWT Token Security**
   - Use strong secret keys (minimum 32 characters)
   - Implement token refresh mechanisms
   - Store tokens securely on client side
   - Use HTTPS for all communications

2. **OTP Security**
   - Generate cryptographically secure OTPs
   - Implement proper expiration handling
   - Log verification attempts for security monitoring
   - Use secure email delivery channels

3. **Input Validation**
   ```typescript
   // Example validation pattern
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const otpPattern = /^\d{6}$/;
   ```

### Data Protection

1. **Environment Variables**
   - Store sensitive data in environment variables
   - Never log sensitive information
   - Use different secrets for development and production

2. **Email Security**
   - Use App Passwords for Gmail SMTP
   - Implement DKIM/SPF for email authentication
   - Monitor email delivery rates

3. **File Upload Security**
   - Validate file types and sizes
   - Scan uploaded files for malware
   - Store files in secure locations

### Network Security

1. **HTTPS Requirement**
   - All API endpoints must use HTTPS
   - Implement HSTS headers
   - Use secure cookies

2. **CORS Configuration**
   - Restrict allowed origins
   - Implement proper preflight handling
   - Use secure credentials mode

3. **API Gateway Security**
   - Implement request rate limiting
   - Use API keys for partner access
   - Monitor and log all API requests

## Client Implementation Guidelines

### Authentication Flow

```typescript
// Customer Authentication Example
async function authenticateCustomer(email: string, otp: string) {
  // Step 1: Send verification code
  const sendResponse = await fetch('/api/auth/send-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (!sendResponse.ok) throw new Error('Failed to send verification');
  
  // Step 2: Verify OTP and get token
  const verifyResponse = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  
  if (!verifyResponse.ok) throw new Error('Invalid OTP');
  
  const { token } = await verifyResponse.json();
  return token;
}
```

### Order Creation

```typescript
// Order Creation Example
async function createOrder(token: string, items: OrderItem[]) {
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  });
  
  if (!response.ok) throw new Error('Failed to create order');
  
  return await response.json();
}
```

### Restaurant QR Generation

```typescript
// QR Generation Example
async function generateRestaurantQR(restaurantId: string, tableNumber: string) {
  const response = await fetch('/api/restaurant/generate-qr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantId, tableNumber })
  });
  
  if (!response.ok) throw new Error('Failed to generate QR code');
  
  return await response.json();
}
```

### Error Handling

```typescript
// Comprehensive Error Handling
async function handleAPIRequest(url: string, options: any) {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Testing Recommendations

1. **Unit Tests**
   - Test individual endpoint functionality
   - Mock external dependencies (email service, OCR)
   - Test error scenarios and edge cases

2. **Integration Tests**
   - Test complete authentication flows
   - Test order creation and retrieval
   - Test QR code generation and parsing

3. **Load Testing**
   - Test API performance under load
   - Test rate limiting functionality
   - Test error handling under stress

### Monitoring and Logging

1. **Request Logging**
   ```javascript
   // Example logging middleware
   const logRequest = (req, res, next) => {
     console.log(`${req.method} ${req.url}`, {
       timestamp: new Date().toISOString(),
       userAgent: req.headers['user-agent'],
       ip: req.ip
     });
     next();
   };
   ```

2. **Error Tracking**
   - Implement structured error logging
   - Use error tracking services (Sentry, Bugsnag)
   - Monitor API health metrics

3. **Performance Monitoring**
   - Track response times
   - Monitor error rates
   - Track resource utilization

**Section sources**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts#L1-L98)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L78)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L1-L161)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L98)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L1-L152)