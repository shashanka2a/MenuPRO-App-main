# Orders API Documentation

<cite>
**Referenced Files in This Document**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts)
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)
- [src/components/pwa/order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx)
- [src/components/pwa/item-detail-screen.tsx](file://src/components/pwa/item-detail-screen.tsx)
- [src/components/pwa-app.tsx](file://src/components/pwa-app.tsx)
- [src/components/restaurant/restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts)
- [EMAIL_SETUP.md](file://EMAIL_SETUP.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
3. [Authentication](#authentication)
4. [Order Creation API](#order-creation-api)
5. [Order History API](#order-history-api)
6. [Data Structures](#data-structures)
7. [Validation Rules](#validation-rules)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Rate Limiting](#rate-limiting)
11. [Example Usage](#example-usage)
12. [Troubleshooting](#troubleshooting)

## Introduction

The MenuPRO Orders API provides a RESTful interface for managing restaurant orders within the digital menu system. This API enables customers to place new orders and retrieve their order history while maintaining security through JWT-based authentication.

The API is built with Next.js 14 and TypeScript, utilizing modern web standards for secure communication and robust error handling. It integrates seamlessly with the PWA frontend application and restaurant dashboard system.

## API Endpoints

The Orders API consists of two primary endpoints:

### POST /api/orders/create
Creates a new order from customer cart items

### GET /api/orders
Retrieves order history for the authenticated user

```mermaid
sequenceDiagram
participant Client as "PWA Client"
participant API as "Orders API"
participant Auth as "Auth Service"
participant Storage as "Order Storage"
Client->>API : POST /api/orders/create
API->>Auth : Validate JWT Token
Auth-->>API : Token Valid
API->>API : Validate Order Items
API->>Storage : Store Order
Storage-->>API : Order Saved
API-->>Client : 201 Created + Order Data
Note over Client,Storage : Order Successfully Created
```

**Diagram sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L40-L95)

## Authentication

All Orders API endpoints require JWT-based authentication using Bearer tokens.

### Authorization Header Format
```
Authorization: Bearer <jwt_token>
```

### Token Validation Process

```mermaid
flowchart TD
Start([API Request]) --> CheckAuth["Check Authorization Header"]
CheckAuth --> HasToken{"Has Bearer Token?"}
HasToken --> |No| Unauthorized["Return 401<br/>Authorization token required"]
HasToken --> |Yes| ExtractToken["Extract JWT Token"]
ExtractToken --> VerifyToken["Verify JWT Signature"]
VerifyToken --> TokenValid{"Token Valid?"}
TokenValid --> |No| InvalidToken["Return 401<br/>Invalid or expired token"]
TokenValid --> |Yes| ProcessRequest["Process API Request"]
ProcessRequest --> Success["Return Success Response"]
Unauthorized --> End([End])
InvalidToken --> End
Success --> End
```

**Diagram sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L40-L55)

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L40-L55)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L55)

## Order Creation API

### Endpoint
```
POST /api/orders/create
```

### Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer <jwt_token>`

### Request Body Schema

```typescript
interface OrderCreationRequest {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    selectedOptions?: {
      size?: string;
      customizations?: string[];
    };
  }>;
}
```

### Example Request
```bash
curl -X POST \
  http://localhost:3000/api/orders/create \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -d '{
    "items": [
      {
        "id": "item123",
        "name": "Gourmet Burger",
        "price": 24.00,
        "quantity": 2,
        "selectedOptions": {
          "size": "Large",
          "customizations": ["Extra Cheese", "No Onions"]
        }
      }
    ]
  }'
```

### Response Format

#### Success Response (201 Created)
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "ORDABC123",
    "total": 48.00,
    "estimatedTime": "15 minutes",
    "status": "pending"
  }
}
```

#### Response Schema
```typescript
interface OrderCreationResponse {
  message: string;
  order: {
    id: string;
    total: number;
    estimatedTime: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
  };
}
```

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L40-L95)
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx#L50-L75)

## Order History API

### Endpoint
```
GET /api/orders
```

### Request Headers
- `Authorization: Bearer <jwt_token>`

### Example Request
```bash
curl -X GET \
  http://localhost:3000/api/orders \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Response Format

#### Success Response (200 OK)
```json
{
  "orders": [
    {
      "id": "ORDABC123",
      "email": "customer@example.com",
      "items": [
        {
          "id": "item123",
          "name": "Gourmet Burger",
          "price": 24.00,
          "quantity": 2,
          "selectedOptions": {
            "size": "Large",
            "customizations": ["Extra Cheese", "No Onions"]
          }
        }
      ],
      "total": 48.00,
      "status": "served",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "estimatedTime": "15 minutes"
    }
  ]
}
```

#### Response Schema
```typescript
interface OrderHistoryResponse {
  orders: Array<{
    id: string;
    email: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      selectedOptions?: {
        size?: string;
        customizations?: string[];
      };
    }>;
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
    createdAt: string;
    estimatedTime: string;
  }>;
}
```

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L97-L130)

## Data Structures

### Order Item Structure

```mermaid
classDiagram
class OrderItem {
+string id
+string name
+number price
+number quantity
+Object selectedOptions
+string size
+string[] customizations
}
class Order {
+string id
+string email
+OrderItem[] items
+number total
+string status
+string createdAt
+string estimatedTime
}
Order --> OrderItem : "contains"
```

**Diagram sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L6-L25)

### Complete Order Object

```typescript
interface Order {
  id: string;
  email: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    selectedOptions?: {
      size?: string;
      customizations?: string[];
    };
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
  createdAt: string;
  estimatedTime: string;
}
```

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L6-L25)

## Validation Rules

### Order Creation Validation

1. **Non-empty Cart Requirement**
   - Must contain at least one item
   - Empty cart returns 400 Bad Request

2. **Item Validation**
   - Each item must have valid ID, name, and price
   - Quantity must be positive integer
   - Price must be numeric and non-negative

3. **JWT Token Validation**
   - Token must be present and in Bearer format
   - Token must be valid and not expired
   - Token must contain valid email claim

### Frontend Validation

```mermaid
flowchart TD
Start([Submit Order]) --> CheckCart["Check Cart Items"]
CheckCart --> HasItems{"Items in Cart?"}
HasItems --> |No| ShowError["Show 'Cart is empty' Error"]
HasItems --> |Yes| ValidateItems["Validate Each Item"]
ValidateItems --> ItemsValid{"All Items Valid?"}
ItemsValid --> |No| ShowValidationError["Show Validation Error"]
ItemsValid --> |Yes| CheckToken["Check Auth Token"]
CheckToken --> TokenExists{"Token Exists?"}
TokenExists --> |No| RedirectAuth["Redirect to Login"]
TokenExists --> |Yes| SubmitAPI["Submit to API"]
SubmitAPI --> Success["Order Placed Successfully"]
ShowError --> End([End])
ShowValidationError --> End
RedirectAuth --> End
Success --> End
```

**Diagram sources**
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx#L50-L75)

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L60-L70)
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx#L50-L75)

## Error Handling

### HTTP Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 201 | Created | Order successfully created |
| 200 | OK | Order history retrieved successfully |
| 400 | Bad Request | Invalid request payload or validation errors |
| 401 | Unauthorized | Missing, invalid, or expired JWT token |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

```json
{
  "message": "Error description"
}
```

### Common Error Scenarios

#### Invalid Cart Submission
```bash
# Request
curl -X POST \
  http://localhost:3000/api/orders/create \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer valid-token' \
  -d '{"items": []}'

# Response
{
  "message": "Order items are required"
}
```

#### Invalid JWT Token
```bash
# Request
curl -X POST \
  http://localhost:3000/api/orders/create \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer invalid-token' \
  -d '{"items": [{"id": "item1", "name": "Test", "price": 10, "quantity": 1}]}'

# Response
{
  "message": "Invalid or expired token"
}
```

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L60-L70)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L55-L65)

## Security Considerations

### JWT Token Security

1. **Token Generation**
   - Uses strong secret key from environment variables
   - Expires after 24 hours
   - Contains only essential claims (email, verified flag)

2. **Token Validation**
   - Verifies signature against secret key
   - Checks expiration time
   - Validates email claim presence

3. **Order Ownership**
   - Orders are associated with user email from JWT
   - GET endpoint filters orders by authenticated user's email
   - Prevents cross-user order access

### Environment Configuration

```typescript
// Recommended environment variables
JWT_SECRET=your-strong-random-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=another-strong-random-secret
```

### Production Security Recommendations

1. Use HTTPS in production
2. Implement proper CORS policies
3. Add rate limiting for API endpoints
4. Log authentication failures
5. Monitor for suspicious activity

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L55-L65)
- [EMAIL_SETUP.md](file://EMAIL_SETUP.md#L1-L48)

## Rate Limiting

### Current Implementation

The current in-memory implementation does not include rate limiting. However, in production environments, consider implementing:

1. **Per-IP Rate Limiting**
   - Limit requests per IP address
   - Different limits for authenticated vs anonymous users

2. **Per-User Rate Limiting**
   - Track requests by authenticated user
   - Prevent abuse of order creation

3. **Implementation Example**
   ```typescript
   // Pseudo-code for rate limiting
   const rateLimit = (req: NextRequest, res: NextResponse) => {
     const ip = req.ip || 'unknown';
     const key = `rate_limit:${ip}`;
     
     // Check Redis/Memory store for rate limit
     // Return 429 if limit exceeded
   };
   ```

### Recommended Limits

| Endpoint | Anonymous | Authenticated |
|----------|-----------|---------------|
| POST /api/orders/create | 5/min | 20/min |
| GET /api/orders | 10/min | 50/min |

## Example Usage

### Complete Order Flow

```mermaid
sequenceDiagram
participant User as "Customer"
participant PWA as "PWA App"
participant API as "Orders API"
participant Auth as "Auth Service"
User->>PWA : Scan QR Code
PWA->>Auth : Verify OTP
Auth-->>PWA : JWT Token
PWA->>PWA : Add Items to Cart
User->>PWA : Place Order
PWA->>API : POST /api/orders/create
API->>API : Validate JWT & Items
API-->>PWA : 201 Created + Order ID
PWA->>User : Show Order Confirmation
User->>PWA : View Order History
PWA->>API : GET /api/orders
API-->>PWA : Order History
PWA->>User : Display Order List
```

**Diagram sources**
- [src/components/pwa-app.tsx](file://src/components/pwa-app.tsx#L1-L154)
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx#L50-L75)

### JavaScript/TypeScript Example

```javascript
// Submit order from frontend
async function submitOrder(cartItems) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const orderData = {
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions
      }))
    };

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Order submission failed:', error);
    throw error;
  }
}
```

### Python Example

```python
import requests
import json

def create_order(token, items):
    url = "http://localhost:3000/api/orders/create"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    data = {
        "items": items
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        return response.json()["order"]
    elif response.status_code == 401:
        raise Exception("Invalid or expired token")
    elif response.status_code == 400:
        raise Exception(f"Bad request: {response.json()['message']}")
    else:
        raise Exception(f"Unexpected error: {response.status_code}")

# Usage example
order_items = [
    {
        "id": "item123",
        "name": "Gourmet Burger",
        "price": 24.00,
        "quantity": 2,
        "selectedOptions": {
            "size": "Large",
            "customizations": ["Extra Cheese", "No Onions"]
        }
    }
]

try:
    order = create_order("your-jwt-token", order_items)
    print(f"Order created: {order['id']}")
except Exception as e:
    print(f"Error: {str(e)}")
```

**Section sources**
- [src/components/pwa/cart-screen.tsx](file://src/components/pwa/cart-screen.tsx#L50-L75)
- [src/components/pwa-app.tsx](file://src/components/pwa-app.tsx#L1-L154)

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Authorization token required" (401)
**Cause**: Missing or malformed Authorization header
**Solution**: 
```bash
# Correct format
curl -H 'Authorization: Bearer your-jwt-token' ...

# Check token validity
echo "your-jwt-token" | base64 -d  # Decode to inspect
```

#### Issue: "Invalid or expired token" (401)
**Cause**: JWT token is invalid or expired
**Solution**:
1. Check token expiration (exp claim)
2. Verify JWT_SECRET environment variable
3. Regenerate token if expired

#### Issue: "Order items are required" (400)
**Cause**: Empty cart or missing items array
**Solution**:
```javascript
// Ensure cart has items
if (!cartItems || cartItems.length === 0) {
  throw new Error('Cart cannot be empty');
}
```

#### Issue: "Failed to create order" (500)
**Cause**: Server-side error
**Solution**:
1. Check server logs for detailed error
2. Verify database connectivity (if using persistent storage)
3. Ensure sufficient memory for order processing

### Debugging Steps

1. **Verify Authentication**
   ```bash
   curl -X GET http://localhost:3000/api/orders \
     -H 'Authorization: Bearer your-token' \
     --verbose
   ```

2. **Test Order Creation**
   ```bash
   curl -X POST http://localhost:3000/api/orders/create \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer your-token' \
     -d '{"items": [{"id": "test", "name": "Test", "price": 10, "quantity": 1}]}'
   ```

3. **Check Environment Variables**
   ```bash
   echo $JWT_SECRET
   echo $NEXTAUTH_URL
   ```

### Logging and Monitoring

Enable detailed logging for troubleshooting:

```typescript
// Add logging to API endpoints
console.log('Order creation request:', { userId: decoded.email, itemCount: items.length });
console.log('New order created:', { orderId: order.id, total: order.total });
```

Monitor key metrics:
- API response times
- Authentication failure rates
- Order creation success rates
- Error distribution by status code

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L40-L95)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L97-L130)