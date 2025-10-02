# Generate QR Code API Documentation

<cite>
**Referenced Files in This Document**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts)
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx)
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts)
- [src/styles/print.css](file://src/styles/print.css)
- [package.json](file://package.json)
- [README.md](file://README.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoint Details](#api-endpoint-details)
3. [Request Schema](#request-schema)
4. [Response Format](#response-format)
5. [Error Responses](#error-responses)
6. [Integration Example](#integration-example)
7. [Security Implementation](#security-implementation)
8. [Performance Optimization](#performance-optimization)
9. [Usage in Restaurant Dashboard](#usage-in-restaurant-dashboard)
10. [Testing and Troubleshooting](#testing-and-troubleshooting)

## Introduction

The MenuPRO QR Code Generation API provides a RESTful endpoint for creating QR codes that link to digital menus for restaurant tables. This API enables restaurants to generate printable QR codes that customers can scan to access interactive digital menus, streamlining the ordering process and enhancing the dining experience.

The API supports both individual table QR code generation and bulk generation for multiple tables, making it suitable for restaurants of all sizes. QR codes are generated as base64-encoded PNG images for optimal compatibility across different platforms and devices.

## API Endpoint Details

### POST /api/restaurant/generate-qr

**HTTP Method:** POST  
**Content-Type:** application/json  
**Required Headers:**
- `Authorization: Bearer <JWT_TOKEN>` - JWT token for authentication
- `Content-Type: application/json` - Request body content type

**Endpoint URL:** `{BASE_URL}/api/restaurant/generate-qr`

**Description:** Generates a QR code for a specific restaurant table that links to the digital menu interface.

**Rate Limiting:** Not explicitly implemented in the current codebase, but should be considered for production deployments.

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L98)

## Request Schema

### Individual QR Code Generation

```json
{
  "restaurantId": "string",
  "tableNumber": "string"
}
```

### Bulk QR Code Generation

```json
{
  "restaurantId": "string",
  "numberOfTables": "number"
}
```

### Parameter Definitions

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `restaurantId` | string | Yes | Unique identifier for the restaurant account |
| `tableNumber` | string | Yes | Specific table number for individual QR generation |
| `numberOfTables` | number | Yes | Number of consecutive tables to generate QR codes for |

### Request Body Validation

The API performs the following validations:
- Both `restaurantId` and `tableNumber` are required for individual generation
- Both `restaurantId` and `numberOfTables` are required for bulk generation
- `numberOfTables` must be greater than 0
- `tableNumber` must be a valid string representation of a number

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L5-L15)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L40-L50)

## Response Format

### Successful Response (200 OK)

#### Individual QR Code Response

```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "https://menupro.app/order?restaurant=rest123&table=5",
  "tableNumber": "5",
  "restaurantId": "rest123"
}
```

#### Bulk QR Code Response

```json
{
  "success": true,
  "qrCodes": [
    {
      "tableNumber": "1",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://menupro.app/order?restaurant=rest123&table=1"
    },
    {
      "tableNumber": "2",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://menupro.app/order?restaurant=rest123&table=2"
    }
  ],
  "totalTables": 10
}
```

### Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates successful operation |
| `qrCode` | string | Base64-encoded PNG image data |
| `url` | string | Direct URL to the digital menu for the table |
| `tableNumber` | string | Table identifier |
| `restaurantId` | string | Restaurant account identifier |
| `qrCodes` | array | Array of QR code objects for bulk generation |
| `totalTables` | number | Total number of tables processed |

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L20-L35)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L55-L75)

## Error Responses

### 400 Bad Request

**Individual Generation Error:**
```json
{
  "message": "Restaurant ID and table number are required"
}
```

**Bulk Generation Error:**
```json
{
  "message": "Restaurant ID and number of tables are required"
}
```

### 401 Unauthorized

**Missing Authorization Header:**
```json
{
  "message": "Authorization token required"
}
```

**Invalid JWT Token:**
```json
{
  "message": "Invalid or expired token"
}
```

### 500 Internal Server Error

**QR Code Generation Failure:**
```json
{
  "message": "Failed to generate QR code"
}
```

**Bulk QR Code Generation Failure:**
```json
{
  "message": "Failed to generate QR codes"
}
```

### Error Handling Implementation

The API implements comprehensive error handling:

```mermaid
flowchart TD
Start([API Request]) --> ValidateAuth["Validate JWT Token"]
ValidateAuth --> AuthValid{"Token Valid?"}
AuthValid --> |No| Return401["Return 401 Unauthorized"]
AuthValid --> |Yes| ValidateBody["Validate Request Body"]
ValidateBody --> BodyValid{"Body Valid?"}
BodyValid --> |No| Return400["Return 400 Bad Request"]
BodyValid --> |Yes| GenerateQR["Generate QR Code"]
GenerateQR --> QRSuccess{"Generation Success?"}
QRSuccess --> |No| Return500["Return 500 Server Error"]
QRSuccess --> |Yes| Return200["Return 200 Success"]
Return401 --> End([End])
Return400 --> End
Return500 --> End
Return200 --> End
```

**Diagram sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L5-L15)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L20-L35)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L40-L50)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L55-L75)

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L10-L15)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L30-L35)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L50-L55)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L80-L85)

## Integration Example

### cURL Command Example

```bash
curl -X POST https://menupro.app/api/restaurant/generate-qr \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "rest123",
    "tableNumber": "5"
  }'
```

### JavaScript Fetch Example

```javascript
async function generateQRCode(restaurantId, tableNumber) {
  try {
    const response = await fetch('/api/restaurant/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        restaurantId,
        tableNumber
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.qrCode;
    
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw error;
  }
}
```

### Frontend Integration

The API integrates seamlessly with the restaurant dashboard component:

```mermaid
sequenceDiagram
participant User as "Restaurant Owner"
participant Dashboard as "Table QR Screen"
participant API as "Generate QR API"
participant QRGen as "QR Generator"
User->>Dashboard : Enter number of tables
Dashboard->>Dashboard : Validate input
Dashboard->>API : POST /api/restaurant/generate-qr
API->>API : Validate JWT token
API->>API : Validate request body
API->>QRGen : Generate QR code data URL
QRGen-->>API : Return base64 PNG
API-->>Dashboard : Return QR code data
Dashboard->>Dashboard : Store QR code data
Dashboard-->>User : Display generated QR codes
```

**Diagram sources**
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L40-L60)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L5-L25)

**Section sources**
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L40-L60)

## Security Implementation

### JWT Token Authentication

The API requires JWT token authentication for all requests:

```mermaid
flowchart TD
Request[API Request] --> ExtractToken["Extract Authorization Header"]
ExtractToken --> CheckFormat{"Bearer Token?"}
CheckFormat --> |No| Return401["Return 401 Unauthorized"]
CheckFormat --> |Yes| VerifyToken["Verify JWT Token"]
VerifyToken --> TokenValid{"Valid Token?"}
TokenValid --> |No| Return401_2["Return 401 Invalid Token"]
TokenValid --> |Yes| ProcessRequest["Process Request"]
Return401 --> End([End])
Return401_2 --> End
ProcessRequest --> End
```

**Diagram sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L25-L45)

### Security Features

1. **JWT Token Validation**: All requests require a valid JWT token
2. **Token Expiration**: Tokens expire after 24 hours (as seen in the verification flow)
3. **HTTPS Requirement**: Production deployments should enforce HTTPS
4. **Input Sanitization**: Request body validation prevents injection attacks

### Environment Variables

Required environment variables for security:

- `JWT_SECRET`: Strong secret key for JWT signing
- `NEXT_PUBLIC_BASE_URL`: Base URL for QR code generation

**Section sources**
- [src/app/api/orders/create/route.ts](file://src/app/api/orders/create/route.ts#L25-L45)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L25-L30)

## Performance Optimization

### QR Code Generation Settings

The API uses optimized QR code generation parameters:

```javascript
const qrCodeDataURL = await QRCode.toDataURL(orderUrl, {
  width: 200,           // Fixed size for consistent rendering
  margin: 2,            // Minimal margin for compact design
  color: {
    dark: '#000000',    // Black for better print contrast
    light: '#FFFFFF'    // White background
  }
});
```

### Performance Recommendations

1. **Image Size Optimization**: Fixed 200x200 pixel size for optimal loading speed
2. **Base64 Encoding**: Efficient binary-to-text encoding for web transmission
3. **Caching Strategy**: Implement client-side caching for frequently accessed QR codes
4. **Batch Processing**: Use bulk generation for multiple tables to reduce API calls

### Caching Implementation Example

```javascript
// Client-side caching example
const qrCache = new Map();

async function getCachedQRCode(restaurantId, tableNumber) {
  const cacheKey = `${restaurantId}-${tableNumber}`;
  
  if (qrCache.has(cacheKey)) {
    return qrCache.get(cacheKey);
  }
  
  const qrCode = await generateQRCode(restaurantId, tableNumber);
  qrCache.set(cacheKey, qrCode);
  
  // Cache expires after 1 hour
  setTimeout(() => qrCache.delete(cacheKey), 3600000);
  
  return qrCode;
}
```

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L25-L35)

## Usage in Restaurant Dashboard

### Table QR Screen Integration

The API integrates with the restaurant dashboard for comprehensive QR code management:

```mermaid
classDiagram
class TableQRScreen {
+string restaurantId
+string restaurantName
+number numberOfTables
+TableQR[] tables
+boolean isGenerating
+string[] selectedTables
+boolean showPreview
+generateTables() void
+toggleTableSelection(tableId) void
+downloadQRCode(table) void
+printQRCode(table) void
+copyURL(url) void
}
class TableQR {
+string id
+string tableNumber
+string qrCode
+string url
+boolean isActive
}
class GenerateQRRoute {
+POST(request) Response
+PUT(request) Response
+validateRequestBody(body) boolean
+generateQRCode(url) string
}
TableQRScreen --> TableQR : "manages"
TableQRScreen --> GenerateQRRoute : "uses"
GenerateQRRoute --> QRCode : "generates"
```

**Diagram sources**
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L15-L30)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L5-L15)

### Dashboard Features

1. **Bulk QR Generation**: Generate QR codes for multiple tables simultaneously
2. **Print Preview**: View QR codes before printing
3. **Download Options**: Save QR codes as PNG files
4. **Print Functionality**: Generate printable PDFs with instructions
5. **Selection Management**: Select multiple QR codes for bulk actions

### Print Styles Implementation

The API supports optimized print styles for physical QR code placement:

```css
.qr-container {
  border: 3px solid #ea580c;
  border-radius: 15px;
  padding: 30px;
  margin: 20px;
  max-width: 400px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.qr-code img {
  max-width: 250px;
  height: auto;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}
```

**Section sources**
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L100-L200)
- [src/styles/print.css](file://src/styles/print.css#L20-L50)

## Testing and Troubleshooting

### Testing Commands

#### Individual QR Code Test

```bash
curl -X POST https://menupro.app/api/restaurant/generate-qr \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId": "test123", "tableNumber": "10"}'
```

#### Bulk QR Code Test

```bash
curl -X POST https://menupro.app/api/restaurant/generate-qr \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId": "test123", "numberOfTables": 5}'
```

### Common Issues and Solutions

#### Issue 1: Invalid JWT Token
**Symptoms:** 401 Unauthorized response
**Solution:** Ensure the JWT token is valid and not expired

#### Issue 2: Missing Required Parameters
**Symptoms:** 400 Bad Request with validation error
**Solution:** Include both `restaurantId` and either `tableNumber` or `numberOfTables`

#### Issue 3: QR Code Generation Failure
**Symptoms:** 500 Internal Server Error
**Solution:** Check server logs for specific error details

#### Issue 4: Large QR Code Images
**Symptoms:** Slow loading or memory issues
**Solution:** Reduce image size or implement client-side compression

### Debugging Tips

1. **Enable Logging**: Check server logs for detailed error messages
2. **Validate Inputs**: Ensure all required parameters are present and valid
3. **Test with Different Sizes**: Verify QR codes work across various table sizes
4. **Browser Compatibility**: Test QR code rendering in different browsers

### Performance Monitoring

Monitor the following metrics:
- API response time
- QR code generation duration
- Memory usage during bulk operations
- Error rates by endpoint

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L10-L15)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L30-L35)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L50-L55)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L80-L85)