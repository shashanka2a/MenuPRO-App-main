# Customer Ordering Flow

<cite>
**Referenced Files in This Document**   
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [onboarding-screen.tsx](file://src/components/pwa/onboarding-screen.tsx)
- [qr-scan-screen.tsx](file://src/components/pwa/qr-scan-screen.tsx)
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx)
- [otp-verification-screen.tsx](file://src/components/pwa/otp-verification-screen.tsx)
- [menu-screen.tsx](file://src/components/pwa/menu-screen.tsx)
- [cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)
- [order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx)
- [route.ts](file://src/app/api/auth/send-verification/route.ts)
- [route.ts](file://src/app/api/auth/verify-otp/route.ts)
- [route.ts](file://src/app/api/orders/create/route.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document provides a comprehensive analysis of the customer ordering flow in the MenuPRO application. The flow begins with the onboarding screen and progresses through QR scanning, email and OTP verification, menu browsing, cart management, and order confirmation. The documentation covers state transitions, navigation logic, error handling, and integration with backend services for authentication and order processing.

## Project Structure

```mermaid
graph TD
subgraph "Components"
PWA[PWA Components]
UI[UI Components]
end
subgraph "API Routes"
Auth[Authentication API]
Orders[Orders API]
end
PWA --> Auth
PWA --> Orders
UI --> PWA
```

**Diagram sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [route.ts](file://src/app/api/auth/send-verification/route.ts)
- [route.ts](file://src/app/api/orders/create/route.ts)

**Section sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [components](file://src/components)

## Core Components

The customer ordering flow consists of several key components that work together to provide a seamless experience. The PWAApp component serves as the central controller, managing state and navigation between different screens. Each screen component is responsible for a specific part of the ordering process, from initial access to order confirmation.

**Section sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [onboarding-screen.tsx](file://src/components/pwa/onboarding-screen.tsx)
- [qr-scan-screen.tsx](file://src/components/pwa/qr-scan-screen.tsx)

## Architecture Overview

```mermaid
sequenceDiagram
participant User as "Customer"
participant PWA as "PWAApp"
participant AuthAPI as "Auth API"
participant OrdersAPI as "Orders API"
User->>PWA : Start App
PWA->>User : Show Onboarding Screen
User->>PWA : Scan QR Code
PWA->>User : Show Email Verification
User->>PWA : Enter Email
PWA->>AuthAPI : Send Verification Email
AuthAPI-->>PWA : Email Sent
PWA->>User : Show OTP Verification
User->>PWA : Enter OTP
PWA->>AuthAPI : Verify OTP
AuthAPI-->>PWA : JWT Token
PWA->>User : Show Menu Screen
User->>PWA : Add Items to Cart
PWA->>User : Show Cart Screen
User->>PWA : Checkout
PWA->>OrdersAPI : Create Order
OrdersAPI-->>PWA : Order Confirmation
PWA->>User : Show Order Confirmation
```

**Diagram sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [route.ts](file://src/app/api/auth/send-verification/route.ts)
- [route.ts](file://src/app/api/auth/verify-otp/route.ts)
- [route.ts](file://src/app/api/orders/create/route.ts)

## Detailed Component Analysis

### Onboarding Screen Analysis

The onboarding screen serves as the entry point to the customer ordering flow. It provides a simple interface that guides users through the initial steps of the process.

```mermaid
flowchart TD
Start([Onboarding Screen]) --> DisplayLogo["Display Logo and Branding"]
DisplayLogo --> ShowSteps["Show Step-by-Step Instructions"]
ShowSteps --> CTA["Display Get Started Button"]
CTA --> End([Navigate to QR Scan])
```

**Diagram sources**
- [onboarding-screen.tsx](file://src/components/pwa/onboarding-screen.tsx)

**Section sources**
- [onboarding-screen.tsx](file://src/components/pwa/onboarding-screen.tsx)

### QR Scan Screen Analysis

The QR scan screen enables table identification by scanning a QR code. This screen provides visual feedback during the scanning process.

```mermaid
flowchart TD
Start([QR Scan Screen]) --> ShowScanner["Display QR Scanner Frame"]
ShowScanner --> CheckScan["Wait for QR Scan"]
CheckScan --> |Scanning| ShowLoading["Show Scanning Animation"]
CheckScan --> |Complete| ShowSuccess["Show Scan Complete"]
ShowSuccess --> End([Navigate to Email Verification])
```

**Diagram sources**
- [qr-scan-screen.tsx](file://src/components/pwa/qr-scan-screen.tsx)

**Section sources**
- [qr-scan-screen.tsx](file://src/components/pwa/qr-scan-screen.tsx)

### Email and OTP Verification Analysis

The email and OTP verification screens handle customer authentication. These screens work together to verify the customer's identity before allowing access to the menu.

```mermaid
sequenceDiagram
participant Customer
participant EmailScreen
participant OTPScreen
participant AuthAPI
Customer->>EmailScreen : Enter Email
EmailScreen->>AuthAPI : POST /api/auth/send-verification
AuthAPI-->>EmailScreen : Email Sent
EmailScreen->>OTPScreen : Navigate to OTP Screen
Customer->>OTPScreen : Enter OTP
OTPScreen->>AuthAPI : POST /api/auth/verify-otp
AuthAPI-->>OTPScreen : JWT Token
OTPScreen->>PWAApp : Return Token
```

**Diagram sources**
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx)
- [otp-verification-screen.tsx](file://src/components/pwa/otp-verification-screen.tsx)
- [route.ts](file://src/app/api/auth/send-verification/route.ts)
- [route.ts](file://src/app/api/auth/verify-otp/route.ts)

**Section sources**
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx)
- [otp-verification-screen.tsx](file://src/components/pwa/otp-verification-screen.tsx)

### Menu and Cart Management Analysis

The menu and cart screens enable customers to browse items, add them to their cart, and manage their selections before checkout.

```mermaid
classDiagram
class MenuItem {
+id : string
+name : string
+description : string
+price : number
+image : string
+category : string
+options? : object
}
class CartItem {
+quantity : number
+selectedOptions? : object
}
class MenuScreen {
+onSelectItem : function
+onViewCart : function
}
class CartScreen {
+onUpdateItem : function
+onCheckout : function
}
MenuItem <|-- CartItem
MenuScreen --> MenuItem
CartScreen --> CartItem
```

**Diagram sources**
- [menu-screen.tsx](file://src/components/pwa/menu-screen.tsx)
- [cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)
- [pwa-app.tsx](file://src/components/pwa-app.tsx)

**Section sources**
- [menu-screen.tsx](file://src/components/pwa/menu-screen.tsx)
- [cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)

### Order Confirmation Analysis

The order confirmation screen provides feedback after a successful order submission, showing order details and next steps.

```mermaid
flowchart TD
Start([Order Confirmation Screen]) --> ShowSuccess["Display Success Icon"]
ShowSuccess --> ShowOrderDetails["Show Order Number and Time"]
ShowOrderDetails --> ShowStatus["Display Order Status"]
ShowStatus --> ShowNextSteps["List What Happens Next"]
ShowNextSteps --> ShowActions["Display Action Buttons"]
ShowActions --> End([Wait for Kitchen Response])
```

**Diagram sources**
- [order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx)

**Section sources**
- [order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx)

## Dependency Analysis

```mermaid
graph TD
PWAApp --> OnboardingScreen
PWAApp --> QRScanScreen
PWAApp --> EmailVerificationScreen
PWAApp --> OTPVerificationScreen
PWAApp --> MenuScreen
PWAApp --> CartScreen
PWAApp --> OrderConfirmationScreen
EmailVerificationScreen --> AuthAPI
OTPVerificationScreen --> AuthAPI
CartScreen --> OrdersAPI
AuthAPI --> EmailService
OrdersAPI --> Database
style PWAApp fill:#f9f,stroke:#333
style AuthAPI fill:#bbf,stroke:#333
style OrdersAPI fill:#bbf,stroke:#333
```

**Diagram sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [route.ts](file://src/app/api/auth/send-verification/route.ts)
- [route.ts](file://src/app/api/orders/create/route.ts)

**Section sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [route.ts](file://src/app/api/auth/send-verification/route.ts)
- [route.ts](file://src/app/api/orders/create/route.ts)

## Performance Considerations

The customer ordering flow is designed with mobile performance in mind. Key performance considerations include:

- **Fast Rendering**: Components use React's useState for efficient state management
- **Optimized Images**: ImageWithFallback component ensures images load properly
- **Minimal Re-renders**: Components are designed to minimize unnecessary re-renders
- **Efficient State Management**: The PWAApp component centralizes state to reduce prop drilling
- **Lazy Loading**: Screens are rendered only when needed based on the current screen state

For optimal mobile performance, the application should:
- Minimize bundle size through code splitting
- Optimize image assets for mobile networks
- Implement proper caching strategies
- Use efficient event handling to prevent memory leaks
- Optimize API calls to reduce latency

**Section sources**
- [pwa-app.tsx](file://src/components/pwa-app.tsx)
- [menu-screen.tsx](file://src/components/pwa/menu-screen.tsx)
- [cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)

## Troubleshooting Guide

Common issues in the customer ordering flow and their solutions:

```mermaid
flowchart TD
Issue[Issue Encountered] --> Identify["Identify Issue Type"]
Identify --> |Email Not Received| EmailIssue
Identify --> |Invalid OTP| OTPIssue
Identify --> |Empty Menu| MenuIssue
Identify --> |Order Failed| OrderIssue
EmailIssue --> CheckSpam["Check Spam Folder"]
EmailIssue --> Resend["Resend Verification Email"]
EmailIssue --> VerifyEmail["Verify Email Address is Correct"]
OTPIssue --> CheckCode["Verify Code is Correct"]
OTPIssue --> CheckExpiry["Check if Code has Expired"]
OTPIssue --> ResendOTP["Request New OTP"]
MenuIssue --> CheckConnection["Check Internet Connection"]
MenuIssue --> Refresh["Refresh the Page"]
MenuIssue --> ContactStaff["Contact Restaurant Staff"]
OrderIssue --> CheckAuth["Verify Authentication Token"]
OrderIssue --> CheckItems["Ensure Cart has Items"]
OrderIssue --> Retry["Retry Order Submission"]
EmailIssue --> Solution
OTPIssue --> Solution
MenuIssue --> Solution
OrderIssue --> Solution
Solution[Issue Resolved]
```

**Section sources**
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx)
- [otp-verification-screen.tsx](file://src/components/pwa/otp-verification-screen.tsx)
- [menu-screen.tsx](file://src/components/pwa/menu-screen.tsx)
- [cart-screen.tsx](file://src/components/pwa/cart-screen.tsx)

## Conclusion

The customer ordering flow in MenuPRO provides a seamless experience from initial access to order confirmation. The flow is well-structured with clear state transitions between screens, proper error handling, and integration with backend services for authentication and order processing. The component-based architecture allows for easy maintenance and extension of functionality. Key strengths include the intuitive user interface, robust authentication process, and clear feedback at each step of the ordering process.