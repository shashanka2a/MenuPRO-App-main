# Restaurant API Documentation

<cite>
**Referenced Files in This Document**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts)
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts)
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx)
- [src/components/restaurant/menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx)
- [package.json](file://package.json)
- [README.md](file://README.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [QR Code Generation API](#qr-code-generation-api)
4. [Menu Parsing API](#menu-parsing-api)
5. [Security Practices](#security-practices)
6. [Performance Considerations](#performance-considerations)
7. [Error Handling](#error-handling)
8. [Integration Examples](#integration-examples)

## Introduction

The Restaurant API provides two primary endpoints for managing restaurant operations: QR code generation for table-specific ordering and menu digitization from PDF or image uploads. These endpoints are designed to streamline restaurant operations by enabling quick menu creation and easy table ordering setup.

The API is built with Next.js 14 and TypeScript, utilizing modern web technologies including QRCode generation, OCR processing with Tesseract.js, and PDF parsing capabilities. All endpoints require JWT authentication for secure access.

## Authentication

The Restaurant API requires JWT authentication for all endpoints. Authentication follows a two-step process involving email verification and OTP verification.

### Authentication Flow

```mermaid
sequenceDiagram
participant Client as "Client Application"
participant Auth as "Auth API"
participant Restaurant as "Restaurant API"
Client->>Auth : POST /api/auth/send-verification
Auth-->>Client : Verification email sent
Client->>Auth : POST /api/auth/verify-otp
Auth-->>Client : JWT token
Client->>Restaurant : POST /api/restaurant/generate-qr<br/>Authorization : Bearer {token}
Restaurant-->>Client : QR code data
```

**Diagram sources**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts#L20-L97)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L15-L77)

**Section sources**
- [src/app/api/auth/send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts#L1-L98)
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L1-L78)

## QR Code Generation API

### POST /api/restaurant/generate-qr

Generates QR codes for individual restaurant tables with embedded order URLs.

#### Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer {jwt_token}`

#### Request Body Schema
```json
{
  "restaurantId": "string",
  "tableNumber": "string"
}
```

#### Response Format
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "https://menupro.app/order?restaurant=restaurantId&table=tableNumber",
  "tableNumber": "string",
  "restaurantId": "string"
}
```

#### Status Codes
- `200 OK`: QR code generated successfully
- `400 Bad Request`: Missing required fields (restaurantId or tableNumber)
- `500 Internal Server Error`: QR code generation failed

#### Example cURL Command
```bash
curl -X POST https://menupro.app/api/restaurant/generate-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "restaurantId": "rest_12345",
    "tableNumber": "7"
  }'
```

### PUT /api/restaurant/generate-qr (Bulk Generation)

Generates QR codes for multiple tables in a single request.

#### Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer {jwt_token}`

#### Request Body Schema
```json
{
  "restaurantId": "string",
  "numberOfTables": "number"
}
```

#### Response Format
```json
{
  "success": true,
  "qrCodes": [
    {
      "tableNumber": "1",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://menupro.app/order?restaurant=restaurantId&table=1"
    },
    {
      "tableNumber": "2",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "url": "https://menupro.app/order?restaurant=restaurantId&table=2"
    }
  ],
  "totalTables": "number"
}
```

#### Status Codes
- `200 OK`: QR codes generated successfully
- `400 Bad Request`: Missing required fields (restaurantId or numberOfTables)
- `500 Internal Server Error`: QR code generation failed

#### Example cURL Command
```bash
curl -X PUT https://menupro.app/api/restaurant/generate-qr \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "restaurantId": "rest_12345",
    "numberOfTables": 10
  }'
```

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L98)
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L45-L102)

## Menu Parsing API

### POST /api/restaurant/parse-menu

Parses menu items from uploaded PDF or image files using OCR technology.

#### Request Headers
- `Content-Type: multipart/form-data`
- `Authorization: Bearer {jwt_token}`

#### Request Body Schema
```json
{
  "file": "File",
  "method": "pdf | physical"
}
```

#### Supported File Formats
- **PDF**: `.pdf` files up to 5MB
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif` up to 5MB

#### OCR Process Details

The menu parsing process utilizes Tesseract.js for optical character recognition:

```mermaid
flowchart TD
Start([File Upload]) --> CheckMethod{"Method Type?"}
CheckMethod --> |PDF| LoadPDF["Load PDF Buffer"]
CheckMethod --> |Image| LoadImage["Load Image Buffer"]
LoadPDF --> ParsePDF["Use pdf-parse library"]
LoadImage --> InitTesseract["Initialize Tesseract Worker"]
InitTesseract --> OCR["Perform OCR Recognition"]
ParsePDF --> ExtractText["Extract Text Content"]
OCR --> ExtractText
ExtractText --> ParseItems["Parse Menu Items"]
ParseItems --> DetectCategories["Detect Food Categories"]
DetectCategories --> ExtractPrices["Extract Price Patterns"]
ExtractPrices --> CalculateConfidence["Calculate Confidence Scores"]
CalculateConfidence --> FilterDuplicates["Remove Duplicates"]
FilterDuplicates --> SortByConfidence["Sort by Confidence"]
SortByConfidence --> End([Return Parsed Items])
```

**Diagram sources**
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L10-L52)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L54-L151)

#### Response Format
```json
{
  "success": true,
  "items": [
    {
      "name": "Grilled Salmon",
      "price": 18.99,
      "description": "Freshly grilled salmon with lemon butter sauce",
      "category": "Entrees",
      "confidence": 0.92
    },
    {
      "name": "Caesar Salad",
      "price": 8.99,
      "description": "Crisp romaine lettuce with parmesan cheese",
      "category": "Appetizers",
      "confidence": 0.85
    }
  ],
  "extractedText": "Grilled Salmon $18.99 Freshly grilled salmon with lemon butter sauce..."
}
```

#### Status Codes
- `200 OK`: Menu parsed successfully
- `400 Bad Request`: No file provided or invalid method
- `500 Internal Server Error`: Menu parsing failed

#### Example cURL Commands

**For PDF Upload:**
```bash
curl -X POST https://menupro.app/api/restaurant/parse-menu \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@menu.pdf" \
  -F "method=pdf"
```

**For Image Upload:**
```bash
curl -X POST https://menupro.app/api/restaurant/parse-menu \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@menu.jpg" \
  -F "method=physical"
```

**Section sources**
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L1-L152)
- [src/components/restaurant/menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L37-L81)

## Security Practices

### File Type Validation

The API implements strict file type validation to prevent malicious uploads:

```typescript
// PDF validation
if (method === 'pdf' && !file.type.startsWith('application/pdf')) {
  return NextResponse.json(
    { message: 'Invalid file type. Please upload a PDF file.' },
    { status: 400 }
  );
}

// Image validation
if (method === 'physical' && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
  return NextResponse.json(
    { message: 'Invalid file type. Please upload an image file.' },
    { status: 400 }
  );
}
```

### File Size Limits

All file uploads are limited to 5MB to prevent resource exhaustion:

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { message: 'File size exceeds limit (5MB)' },
    { status: 400 }
  );
}
```

### JWT Authentication

All endpoints require valid JWT tokens with restaurant permissions:

```typescript
// Token validation middleware
const token = request.headers.get('authorization')?.split(' ')[1];
if (!token) {
  return NextResponse.json(
    { message: 'Authentication required' },
    { status: 401 }
  );
}

try {
  jwt.verify(token, process.env.JWT_SECRET!);
} catch (error) {
  return NextResponse.json(
    { message: 'Invalid token' },
    { status: 401 }
  );
}
```

**Section sources**
- [src/app/api/auth/verify-otp/route.ts](file://src/app/api/auth/verify-otp/route.ts#L15-L77)
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L5-L15)

## Performance Considerations

### QR Code Generation Performance

QR code generation is optimized for speed and quality:

- **Default Dimensions**: 200x200 pixels with 2px margin
- **Color Scheme**: Black foreground, white background for optimal scanning
- **Bulk Generation**: Parallel processing for multiple tables
- **Error Handling**: Graceful degradation when individual QR codes fail

### Menu Parsing Performance

Menu parsing performance varies based on file characteristics:

- **PDF Processing**: Fast text extraction using pdf-parse library
- **OCR Processing**: Variable performance based on image quality and text complexity
- **Memory Management**: Tesseract workers are terminated after each operation
- **Text Truncation**: Response text is truncated to 500 characters for performance

### Optimization Tips

1. **Pre-process Images**: Ensure high-quality images with good contrast for better OCR results
2. **Optimize PDFs**: Use clean, well-formatted PDFs for better text extraction
3. **Batch Operations**: Use bulk QR generation for multiple tables
4. **Monitor File Sizes**: Keep files under 5MB for optimal performance

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L17-L48)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L17-L52)

## Error Handling

### Common Error Scenarios

#### QR Code Generation Errors
- **Missing Parameters**: Returns 400 with field validation errors
- **QR Generation Failure**: Returns 500 with error details
- **Network Issues**: Graceful fallback with appropriate error messages

#### Menu Parsing Errors
- **Unsupported File Types**: Returns 400 with file type validation errors
- **OCR Processing Failures**: Returns 500 with Tesseract.js error details
- **PDF Parsing Errors**: Returns 500 with pdf-parse error details

### Error Response Format
```json
{
  "message": "Descriptive error message",
  "details": "Optional technical details"
}
```

### Retry Strategies

For transient failures, implement exponential backoff:

```typescript
async function retryOperation(operation: () => Promise<any>, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw lastError;
}
```

**Section sources**
- [src/app/api/restaurant/generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L20-L30)
- [src/app/api/restaurant/parse-menu/route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L40-L50)

## Integration Examples

### React Component Integration

Here's how to integrate with React components:

```typescript
// QR Code Generation
const generateQR = async (restaurantId: string, tableNumber: string) => {
  try {
    const response = await fetch('/api/restaurant/generate-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ restaurantId, tableNumber })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate QR code');
    }
    
    const data = await response.json();
    return data.qrCode;
  } catch (error) {
    console.error('QR generation error:', error);
    throw error;
  }
};

// Menu Parsing
const parseMenu = async (file: File, method: 'pdf' | 'physical') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('method', method);
  
  try {
    const response = await fetch('/api/restaurant/parse-menu', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to parse menu');
    }
    
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Menu parsing error:', error);
    throw error;
  }
};
```

### Frontend Implementation

The frontend components provide comprehensive UI for these APIs:

- **TableQRScreen**: Generates and manages QR codes for restaurant tables
- **MenuUploadScreen**: Handles menu file uploads and displays parsed results
- **Progress Indicators**: Real-time feedback during processing
- **Error Handling**: User-friendly error messages and retry options

**Section sources**
- [src/components/restaurant/table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L45-L102)
- [src/components/restaurant/menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L37-L81)