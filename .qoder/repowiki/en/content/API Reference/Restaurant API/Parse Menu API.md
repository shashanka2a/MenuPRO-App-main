# Parse Menu API Documentation

<cite>
**Referenced Files in This Document**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts)
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx)
- [send-verification/route.ts](file://src/app/api/auth/send-verification/route.ts)
- [verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts)
- [orders/create/route.ts](file://src/app/api/orders/create/route.ts)
- [package.json](file://package.json)
- [README.md](file://README.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Endpoint Specification](#endpoint-specification)
3. [Request Details](#request-details)
4. [Response Schema](#response-schema)
5. [Processing Flow](#processing-flow)
6. [Error Handling](#error-handling)
7. [Security Considerations](#security-considerations)
8. [Performance Optimization](#performance-optimization)
9. [Example Implementation](#example-implementation)
10. [Accuracy and Quality Guidelines](#accuracy-and-quality-guidelines)

## Introduction

The Parse Menu API is a specialized endpoint designed to extract menu items from uploaded documents or images. This API supports both PDF documents and physical menu photos, utilizing advanced OCR (Optical Character Recognition) technology to parse menu information accurately. The service is part of the MenuPRO restaurant management system, enabling restaurants to quickly digitize their menus while maintaining high accuracy through intelligent parsing algorithms.

## Endpoint Specification

### HTTP Method and URL
- **Method**: `POST`
- **URL**: `/api/restaurant/parse-menu`
- **Content-Type**: `multipart/form-data`

### Required Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: multipart/form-data`

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L1-L152)

## Request Details

### File Upload Parameters

The API accepts a multipart form data request containing two main parameters:

#### Required Parameters
- **file** (`File`): The menu document or image file to be processed
  - **Size Limit**: Maximum 5MB
  - **Supported Formats**: PDF, JPG, PNG
  - **File Type Validation**: Automatic detection and validation

#### Optional Parameters
- **method** (`string`): Processing method specification
  - **Values**: `'pdf'` or `'physical'`
  - **Default**: `'physical'` (OCR processing)
  - **Purpose**: Explicitly define whether to use PDF parsing or OCR

### Request Body Structure

```json
{
  "file": "<File object>",
  "method": "pdf|physical"
}
```

### Content-Type Requirements

The API strictly requires `multipart/form-data` content type for proper file handling and parameter parsing.

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L5-L25)
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L50-L80)

## Response Schema

### Successful Response (200 OK)

When menu parsing completes successfully, the API returns a structured JSON response:

```json
{
  "success": true,
  "items": [
    {
      "name": "Grilled Salmon",
      "price": 18.99,
      "description": "Freshly grilled salmon served with seasonal vegetables",
      "category": "Entrees",
      "confidence": 0.85
    }
  ],
  "extractedText": "Menu text excerpt..."
}
```

### Response Fields Description

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Indicates successful parsing operation |
| `items` | `Array<Object>` | Parsed menu items with structured data |
| `extractedText` | `string` | Truncated raw text (first 500 chars) |

### Menu Item Structure

Each menu item contains the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Menu item name |
| `price` | `number` | Item price in USD |
| `description` | `string` | Optional item description |
| `category` | `string` | Menu category (defaults to 'Main Course') |
| `confidence` | `number` | Parsing confidence score (0.0-1.0) |

### Error Responses

#### Bad Request (400)
```json
{
  "message": "No file provided"
}
```

#### Unauthorized (401)
```json
{
  "message": "Invalid or expired token"
}
```

#### Unsupported Media Type (415)
```json
{
  "message": "Unsupported file type"
}
```

#### Internal Server Error (500)
```json
{
  "message": "Failed to parse menu"
}
```

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L26-L40)
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L140-L152)

## Processing Flow

### Backend Processing Pipeline

The API implements a sophisticated multi-stage processing pipeline:

```mermaid
flowchart TD
Start([API Request Received]) --> ValidateAuth["Validate JWT Token"]
ValidateAuth --> AuthValid{"Auth Valid?"}
AuthValid --> |No| Return401["Return 401 Unauthorized"]
AuthValid --> |Yes| ParseFormData["Parse Form Data"]
ParseFormData --> CheckFile{"File Present?"}
CheckFile --> |No| Return400["Return 400 Bad Request"]
CheckFile --> |Yes| DetermineMethod["Determine Processing Method"]
DetermineMethod --> IsPDF{"Method == 'pdf'?"}
IsPDF --> |Yes| LoadPDF["Load PDF Parser"]
IsPDF --> |No| LoadOCR["Load OCR Engine"]
LoadPDF --> ParsePDF["Extract Text from PDF"]
LoadOCR --> InitOCR["Initialize Tesseract.js Worker"]
InitOCR --> ProcessImage["Process Image with OCR"]
ProcessImage --> TerminateOCR["Terminate OCR Worker"]
ParsePDF --> ExtractText["Extract Text Content"]
TerminateOCR --> ExtractText
ExtractText --> ParseMenu["Parse Menu Items"]
ParseMenu --> FilterDuplicates["Remove Duplicates"]
FilterDuplicates --> SortByConfidence["Sort by Confidence"]
SortByConfidence --> ReturnSuccess["Return Parsed Menu"]
Return401 --> End([End])
Return400 --> End
ReturnSuccess --> End
```

**Diagram sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L5-L152)

### Processing Methods

#### PDF Processing (method='pdf')
1. **File Loading**: Convert uploaded file to ArrayBuffer
2. **PDF Parsing**: Utilize `pdf-parse` library for text extraction
3. **Text Extraction**: Extract readable text content from PDF pages
4. **Menu Parsing**: Apply menu item recognition algorithms

#### Image/OCR Processing (method='physical')
1. **File Loading**: Convert uploaded image to ArrayBuffer
2. **OCR Initialization**: Initialize Tesseract.js worker with English language model
3. **Text Recognition**: Process image through OCR engine
4. **Text Cleanup**: Clean and normalize recognized text
5. **OCR Termination**: Properly terminate worker to free resources

### Menu Item Parsing Algorithm

The parsing algorithm employs intelligent pattern recognition:

```mermaid
flowchart TD
StartParsing([Begin Text Parsing]) --> SplitLines["Split Text into Lines"]
SplitLines --> ProcessLine["Process Each Line"]
ProcessLine --> CheckCategory{"Contains Category?"}
CheckCategory --> |Yes| UpdateCategory["Update Current Category"]
CheckCategory --> |No| DetectPrice{"Price Pattern Found?"}
DetectPrice --> |Yes| ExtractName["Extract Item Name"]
DetectPrice --> |No| NextLine["Process Next Line"]
ExtractName --> ValidateName{"Name Valid?"}
ValidateName --> |No| NextLine
ValidateName --> |Yes| ExtractDescription["Extract Description"]
ExtractDescription --> CalculateConfidence["Calculate Confidence Score"]
CalculateConfidence --> AddItem["Add Menu Item"]
AddItem --> NextLine
UpdateCategory --> NextLine
NextLine --> MoreLines{"More Lines?"}
MoreLines --> |Yes| ProcessLine
MoreLines --> |No| RemoveDuplicates["Remove Duplicate Items"]
RemoveDuplicates --> SortItems["Sort by Confidence"]
SortItems --> EndParsing([End Parsing])
```

**Diagram sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L42-L139)

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L15-L40)
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L42-L139)

## Error Handling

### Authentication Errors

The API implements robust JWT-based authentication:

```mermaid
sequenceDiagram
participant Client as "Client Application"
participant API as "Parse Menu API"
participant Auth as "Authentication Service"
Client->>API : POST /api/restaurant/parse-menu
Note over Client,API : Missing/Invalid Authorization Header
API->>API : Check Authorization Header
API->>API : Validate JWT Token
API->>API : Verify Token Expiration
API->>API : Decode Token Payload
API->>API : Check Restaurant Permissions
API-->>Client : 401 Unauthorized
Note over Client,API : "Invalid or expired token"
```

**Diagram sources**
- [orders/create/route.ts](file://src/app/api/orders/create/route.ts#L48-L55)

### File Processing Errors

Common error scenarios and their handling:

| Error Type | Status Code | Message | Cause |
|------------|-------------|---------|-------|
| No file provided | 400 | "No file provided" | Missing required file parameter |
| Unsupported format | 415 | "Unsupported file type" | Invalid file extension |
| File too large | 413 | "File size exceeds limit" | Exceeds 5MB limit |
| OCR processing failure | 500 | "Failed to parse menu" | OCR engine error |
| PDF parsing failure | 500 | "Failed to parse menu" | PDF corruption or parsing error |

### Error Recovery Strategies

The API implements graceful error handling with appropriate HTTP status codes and descriptive error messages to facilitate debugging and client-side error handling.

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L14-L25)
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L140-L152)

## Security Considerations

### Authentication and Authorization

The API requires JWT-based authentication with restaurant-specific permissions:

```mermaid
classDiagram
class JWTToken {
+string email
+string type
+boolean verified
+number iat
+validateSignature() boolean
+checkExpiration() boolean
}
class RestaurantAuth {
+verifyRestaurantToken(token) boolean
+extractRestaurantInfo(payload) RestaurantInfo
+checkPermissions(role) boolean
}
class AuthMiddleware {
-restaurantAuth RestaurantAuth
+handleRequest(req) Response
+validateToken(header) JWTToken
+authorizeAccess(token) boolean
}
AuthMiddleware --> RestaurantAuth : uses
RestaurantAuth --> JWTToken : validates
```

**Diagram sources**
- [verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts#L44-L50)
- [orders/create/route.ts](file://src/app/api/orders/create/route.ts#L48-L55)

### File Security Measures

#### File Type Validation
- Automatic MIME type detection
- Extension-based validation
- Content-based verification
- Size limitation enforcement

#### Virus Scanning (Implementation Consideration)
While not currently implemented, the architecture supports future virus scanning integration:

```typescript
// Future enhancement placeholder
async function scanFileForViruses(file: File): Promise<boolean> {
  // Placeholder for antivirus scanning logic
  return true; // Assume clean for now
}
```

#### Secure File Handling
- Temporary file storage with automatic cleanup
- Memory-efficient processing for large files
- Resource cleanup after processing completion

### Data Protection

- Sensitive menu data is not stored permanently
- Processing occurs in memory during request lifecycle
- No audit trail maintained for privacy compliance
- Encrypted transmission over HTTPS required

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L14-L25)
- [verify-otp/route.ts](file://src/app/api/restaurant/verify-otp/route.ts#L44-L81)

## Performance Optimization

### OCR Processing Optimization

The API implements several strategies to optimize OCR processing performance:

#### Worker Management
```typescript
// Efficient OCR worker lifecycle
const worker = await createWorker('eng');
try {
  const { data: { text } } = await worker.recognize(imageBuffer);
  return text;
} finally {
  await worker.terminate(); // Critical resource cleanup
}
```

#### Image Preprocessing Recommendations
- **Resolution**: Minimum 300 DPI for optimal OCR accuracy
- **Format**: JPEG preferred over PNG for smaller file sizes
- **Quality**: Brightness and contrast adjustments improve recognition
- **Noise Reduction**: Minimal background noise enhances accuracy

### Memory Management

```mermaid
flowchart LR
Upload[File Upload] --> Buffer[Convert to Buffer]
Buffer --> Process[Process Content]
Process --> Cleanup[Immediate Cleanup]
Cleanup --> Response[Return Response]
subgraph "Memory Optimization"
Buffer
Process
Cleanup
end
```

**Diagram sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L25-L35)

### Large File Handling

For files approaching the 5MB limit:

1. **Compression**: Enable image compression before upload
2. **Batch Processing**: Consider splitting large menus into smaller chunks
3. **Timeout Management**: Monitor processing time and implement timeouts
4. **Resource Monitoring**: Track memory usage during processing

### Caching Strategy

While not implemented in the current version, the architecture supports caching for frequently processed menu formats:

```typescript
// Future caching implementation
const cacheKey = `menu:${fileHash}:${method}`;
const cachedResult = await redis.get(cacheKey);
if (cachedResult) {
  return JSON.parse(cachedResult);
}
```

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L25-L35)
- [package.json](file://package.json#L1-L89)

## Example Implementation

### cURL Command Example

```bash
curl -X POST \
  https://your-domain.com/api/restaurant/parse-menu \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: multipart/form-data" \
  -F "file=@menu.pdf" \
  -F "method=pdf"
```

### JavaScript Implementation

```javascript
async function parseMenu(file, method = 'physical') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('method', method);
  
  try {
    const response = await fetch('/api/restaurant/parse-menu', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('restaurantAuthToken')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items;
    
  } catch (error) {
    console.error('Menu parsing failed:', error);
    throw error;
  }
}
```

### Python Implementation

```python
import requests

def parse_menu(file_path, method='physical'):
    with open(file_path, 'rb') as file:
        files = {
            'file': (file_path, file, 'application/pdf'),
            'method': (None, method)
        }
        
        headers = {
            'Authorization': f'Bearer {jwt_token}'
        }
        
        response = requests.post(
            'https://your-domain.com/api/restaurant/parse-menu',
            headers=headers,
            files=files
        )
        
        response.raise_for_status()
        return response.json()['items']
```

**Section sources**
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L50-L80)

## Accuracy and Quality Guidelines

### OCR Accuracy Considerations

The API's accuracy depends on several factors:

#### Image Quality Factors
- **Resolution**: Higher DPI improves recognition accuracy
- **Lighting**: Even lighting prevents shadows and glare
- **Clarity**: Sharp, well-defined text yields better results
- **Background**: Simple backgrounds enhance OCR performance

#### Recommended Image Specifications
- **Minimum Resolution**: 300 DPI
- **Format**: JPEG (.jpg) or PNG (.png)
- **Max Size**: 5MB
- **Orientation**: Portrait or landscape based on menu layout

### Fallback Strategies

When OCR accuracy is insufficient:

1. **Manual Review**: Flag low-confidence items for manual review
2. **Alternative Formats**: Offer PDF processing as primary option
3. **Retry Mechanism**: Allow re-uploads with improved quality
4. **Hybrid Approach**: Combine OCR with template-based parsing

### Confidence Scoring

The API implements a sophisticated confidence scoring system:

```mermaid
graph TD
BaseScore[Base Confidence: 0.5] --> NameLength{Name Length > 5? +0.1]
BaseScore --> PriceRange{Price $5-$100? +0.2}
BaseScore --> HasDesc{Has Description? +0.1}
BaseScore --> FoodKeywords{Food Keywords? +0.2}
NameLength --> FinalScore[Final Score ≤ 0.95]
PriceRange --> FinalScore
HasDesc --> FinalScore
FoodKeywords --> FinalScore
FinalScore --> Categories[Menu Categories]
Categories --> Appetizers[Appetizers]
Categories --> Entrees[Entrees]
Categories --> Desserts[Desserts]
Categories --> Beverages[Beverages]
```

**Diagram sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L100-L139)

### Quality Assurance

#### Validation Rules
- **Item Name**: Minimum 3 characters, no pure numbers
- **Price Range**: Logical price boundaries ($0.50 - $999.99)
- **Category Matching**: Recognized food categories
- **Duplicate Removal**: Automatic deduplication by name

#### Post-Processing Enhancements
- **Text Normalization**: Standardize spacing and punctuation
- **Price Formatting**: Consistent decimal representation
- **Category Classification**: Intelligent category assignment
- **Description Extraction**: Contextual description identification

**Section sources**
- [route.ts](file://src/app/api/restaurant/parse-menu/route.ts#L100-L139)