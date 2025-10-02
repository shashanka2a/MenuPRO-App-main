# Restaurant Dashboard UI

<cite>
**Referenced Files in This Document**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx)
- [restaurant-app.tsx](file://src/components/restaurant/restaurant-app.tsx)
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx)
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx)
- [table.tsx](file://src/components/ui/table.tsx)
- [chart.tsx](file://src/components/ui/chart.tsx)
- [button.tsx](file://src/components/ui/button.tsx)
- [tabs.tsx](file://src/components/ui/tabs.tsx)
- [card.tsx](file://src/components/ui/card.tsx)
- [badge.tsx](file://src/components/ui/badge.tsx)
- [layout.tsx](file://src/app/layout.tsx)
- [utils.ts](file://src/components/ui/utils.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Core Components](#core-components)
4. [Dashboard Layout Structure](#dashboard-layout-structure)
5. [Data Display Patterns](#data-display-patterns)
6. [QR Settings and Generation](#qr-settings-and-generation)
7. [Order Management System](#order-management-system)
8. [Menu Management Features](#menu-management-features)
9. [Analytics and Statistics](#analytics-and-statistics)
10. [Accessibility Features](#accessibility-features)
11. [Responsive Design Implementation](#responsive-design-implementation)
12. [State Management](#state-management)
13. [Navigation and Workflow](#navigation-and-workflow)
14. [Future Integration Points](#future-integration-points)
15. [Troubleshooting Guide](#troubleshooting-guide)
16. [Conclusion](#conclusion)

## Introduction

The Restaurant Dashboard UI in MenuPRO-App-main serves as a centralized interface for restaurant operators to manage their digital menu system, monitor active orders, and configure QR settings. Built with modern React patterns and utilizing Radix UI primitives, the dashboard provides a comprehensive view of restaurant operations while maintaining accessibility standards and responsive design principles.

The dashboard integrates seamlessly with the broader MenuPRO ecosystem, offering real-time order tracking, menu item management, and analytics capabilities. It follows a desktop-first design approach with intelligent responsive breakpoints that adapt to various screen sizes while preserving functionality and user experience.

## Architecture Overview

The Restaurant Dashboard follows a modular architecture built around reusable UI components and state-driven data management. The system is structured as a component hierarchy that promotes reusability and maintainability.

```mermaid
graph TB
subgraph "Application Layer"
RA[RestaurantApp]
RD[RestaurantDashboard]
end
subgraph "UI Components"
BT[Button]
TC[Table]
CC[Card]
BD[Badge]
TB[Tabs]
CH[Chart]
end
subgraph "Data Layer"
OD[Order Data]
MD[Menu Data]
RD2[Restaurant Data]
end
subgraph "External Services"
API[REST API]
QR[QR Generator]
AUTH[Authentication]
end
RA --> RD
RD --> BT
RD --> TC
RD --> CC
RD --> BD
RD --> TB
RD --> CH
RD --> OD
RD --> MD
RD --> RD2
RD --> API
RD --> QR
RD --> AUTH
```

**Diagram sources**
- [restaurant-app.tsx](file://src/components/restaurant/restaurant-app.tsx#L1-L134)
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L1-L370)

**Section sources**
- [restaurant-app.tsx](file://src/components/restaurant/restaurant-app.tsx#L1-L134)
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L1-L370)

## Core Components

The Restaurant Dashboard is built using a collection of specialized UI components that provide consistent styling and behavior across the interface. These components are designed with accessibility in mind and follow established design patterns.

### Button Component System

The dashboard utilizes a sophisticated button variant system that provides consistent styling across different interaction states and contexts. The button component supports multiple variants including default, destructive, outline, secondary, ghost, and link styles.

```mermaid
classDiagram
class Button {
+variant : string
+size : string
+asChild : boolean
+className : string
+onClick() : void
+disabled : boolean
}
class ButtonVariants {
+default : string
+destructive : string
+outline : string
+secondary : string
+ghost : string
+link : string
}
class ButtonSizes {
+default : string
+sm : string
+lg : string
+icon : string
}
Button --> ButtonVariants : "uses"
Button --> ButtonSizes : "uses"
```

**Diagram sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)

### Card Component Architecture

The Card component provides a flexible container system that supports various content layouts and interaction patterns. Each card can contain headers, footers, titles, descriptions, and action buttons.

```mermaid
classDiagram
class Card {
+className : string
+children : ReactNode
}
class CardHeader {
+className : string
+children : ReactNode
}
class CardContent {
+className : string
+children : ReactNode
}
class CardFooter {
+className : string
+children : ReactNode
}
class CardTitle {
+className : string
+children : ReactNode
}
Card --> CardHeader : "contains"
Card --> CardContent : "contains"
Card --> CardFooter : "contains"
Card --> CardTitle : "contains"
```

**Diagram sources**
- [card.tsx](file://src/components/ui/card.tsx#L1-L93)

### Badge Component System

The Badge component provides contextual status indicators with customizable variants and styling options. It supports various visual states and interaction patterns.

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)
- [card.tsx](file://src/components/ui/card.tsx#L1-L93)
- [badge.tsx](file://src/components/ui/badge.tsx#L1-L47)

## Dashboard Layout Structure

The Restaurant Dashboard employs a sophisticated layout structure that prioritizes information hierarchy and user workflow efficiency. The design follows a desktop-first approach with intelligent responsive adaptations.

### Header Structure

The dashboard header provides essential navigation and identification elements while maintaining visual consistency across the interface.

```mermaid
flowchart TD
Header[Dashboard Header] --> Logo[MenuPRO Logo]
Header --> RestaurantName[Restaurant Name]
Header --> Settings[Settings Button]
Header --> Logout[Logout Button]
Logo --> LogoImg[Logo Image]
RestaurantName --> NameDisplay[Display Restaurant Name]
Settings --> SettingsIcon[Settings Icon]
Logout --> LogoutIcon[Logout Icon]
```

**Diagram sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L100-L120)

### Grid-Based Statistics Layout

The statistics section utilizes a responsive grid system that adapts to different screen sizes while maintaining optimal information density.

```mermaid
graph LR
subgraph "Statistics Grid"
TotalOrders[Total Orders<br/>BarChart3 Icon]
PendingOrders[Pending Orders<br/>AlertTriangle Icon]
Revenue[Today's Revenue<br/>DollarSign Icon]
AvgValue[Average Order Value<br/>TrendingUp Icon]
end
TotalOrders --> OrdersCard[Card Component]
PendingOrders --> PendingCard[Card Component]
Revenue --> RevenueCard[Card Component]
AvgValue --> AvgCard[Card Component]
```

**Diagram sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L130-L200)

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L100-L200)

## Data Display Patterns

The dashboard implements sophisticated data display patterns using Radix UI components and custom styling to present complex information in an intuitive manner.

### Order Status Management

The order management system uses a comprehensive status tracking mechanism with visual indicators and actionable controls.

```mermaid
stateDiagram-v2
[*] --> Pending
Pending --> Confirmed : Confirm Order
Pending --> Preparing : Start Preparing
Confirmed --> Preparing : Start Preparing
Preparing --> Ready : Mark Ready
Ready --> Served : Mark Served
Served --> [*]
Pending : Yellow Badge<br/>Clock Icon
Confirmed : Blue Badge<br/>Check Icon
Preparing : Orange Badge<br/>Refresh Icon
Ready : Green Badge<br/>Bell Icon
Served : Gray Badge<br/>Check Icon
```

**Diagram sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L60-L90)

### Table Data Presentation

The dashboard utilizes the custom Table component to present order data in a structured, accessible format with proper semantic markup.

```mermaid
classDiagram
class OrderTable {
+headers : string[]
+rows : OrderRow[]
+actions : OrderAction[]
}
class OrderRow {
+id : string
+customer : string
+items : MenuItem[]
+total : number
+status : string
+time : string
}
class MenuItem {
+name : string
+quantity : number
+price : number
}
class OrderAction {
+confirm : boolean
+prepare : boolean
+ready : boolean
+serve : boolean
}
OrderTable --> OrderRow : "contains"
OrderRow --> MenuItem : "includes"
OrderRow --> OrderAction : "provides"
```

**Diagram sources**
- [table.tsx](file://src/components/ui/table.tsx#L1-L117)
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L200-L300)

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L200-L300)
- [table.tsx](file://src/components/ui/table.tsx#L1-L117)

## QR Settings and Generation

The QR settings functionality provides comprehensive QR code generation and management capabilities for restaurant table integration. The system supports bulk generation, individual customization, and various export formats.

### QR Code Generation Process

The QR code generation follows a streamlined process that handles both individual and bulk generation scenarios.

```mermaid
sequenceDiagram
participant User as Restaurant Owner
participant UI as QR Screen
participant API as QR API
participant Storage as QR Storage
User->>UI : Enter Number of Tables
UI->>UI : Validate Input
UI->>API : POST /generate-qr
API->>Storage : Generate QR Data URL
Storage-->>API : Return QR Code
API-->>UI : QR Code Data
UI->>UI : Render QR Grid
UI-->>User : Display Generated Codes
Note over User,Storage : Bulk Generation Available
```

**Diagram sources**
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L45-L102)
- [generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L96)

### QR Code Management Features

The QR management system provides comprehensive tools for organizing, previewing, and exporting QR codes.

```mermaid
flowchart TD
QRManagement[QR Code Management] --> Preview[Preview Mode]
QRManagement --> Selection[Multi-Select]
QRManagement --> Export[Export Options]
QRManagement --> Print[Print Options]
Preview --> ShowQR[Show QR Images]
Preview --> HideQR[Hide QR Images]
Selection --> SelectAll[Select All Tables]
Selection --> DeselectAll[Deselect All Tables]
Selection --> IndividualSelect[Individual Selection]
Export --> DownloadSingle[Download Single]
Export --> DownloadBulk[Download All Selected]
Print --> PrintSingle[Print Single]
Print --> PrintBulk[Print All Selected]
```

**Diagram sources**
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L310-L456)

**Section sources**
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L1-L515)
- [generate-qr/route.ts](file://src/app/api/restaurant/generate-qr/route.ts#L1-L96)

## Order Management System

The order management system provides real-time tracking and status updates for restaurant orders. The system supports manual order creation and automated order processing through the QR code system.

### Order Lifecycle Management

The order lifecycle follows a structured progression with appropriate visual feedback and user actions at each stage.

```mermaid
stateDiagram-v2
[*] --> Pending
Pending --> Confirmed : Manual Confirmation
Pending --> Preparing : Manual Preparation
Confirmed --> Preparing : Manual Preparation
Preparing --> Ready : Mark Ready
Ready --> Served : Mark Served
Served --> [*]
Pending : Yellow Background<br/>Clock Icon<br/>Pending Status
Confirmed : Blue Background<br/>Check Icon<br/>Confirmed Status
Preparing : Orange Background<br/>Refresh Icon<br/>Preparing Status
Ready : Green Background<br/>Bell Icon<br/>Ready Status
Served : Gray Background<br/>Check Icon<br/>Served Status
```

**Diagram sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L60-L90)

### Order Status Controls

Each order displays appropriate action buttons based on its current status, enabling efficient order processing workflows.

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L200-L350)

## Menu Management Features

The menu management system provides tools for adding, editing, and organizing menu items. While currently in development phase, the system includes comprehensive parsing capabilities for physical menus and PDF documents.

### Menu Upload and Parsing

The menu upload system supports multiple input methods with AI-powered parsing for automatic menu item extraction.

```mermaid
flowchart TD
UploadChoice[Upload Method Choice] --> PhysicalMenu[Physical Menu Photo]
UploadChoice --> PDFUpload[PDF Menu Upload]
PhysicalMenu --> CameraCapture[Camera Capture]
PhysicalMenu --> FileUpload[File Upload]
CameraCapture --> AIParsing[AI OCR Processing]
FileUpload --> AIParsing
PDFUpload --> TextParsing[Text Parsing]
AIParsing --> ConfidenceCheck{Confidence Check}
TextParsing --> ConfidenceCheck
ConfidenceCheck --> |High (>80%)| AutoAdd[Auto Add Item]
ConfidenceCheck --> |Medium (60-80%)| Review[Manual Review]
ConfidenceCheck --> |Low (<60%)| Reject[Reject Item]
AutoAdd --> MenuReview[Menu Review]
Review --> ManualAdd[Manual Add]
ManualAdd --> MenuReview
Reject --> Retry[Retry Upload]
MenuReview --> SaveMenu[Save Menu]
```

**Diagram sources**
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L1-L447)

**Section sources**
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L1-L447)

## Analytics and Statistics

The analytics section provides placeholder areas for future implementation of comprehensive restaurant performance metrics and reporting capabilities.

### Statistics Card Layout

The statistics cards present key performance indicators in a visually appealing and accessible format.

```mermaid
graph TB
subgraph "Statistics Cards"
TotalOrders[Total Orders<br/>BarChart3 Icon<br/>Count Display]
PendingOrders[Pending Orders<br/>AlertTriangle Icon<br/>Count Display]
Revenue[Today's Revenue<br/>DollarSign Icon<br/>Amount Display]
AvgValue[Average Order Value<br/>TrendingUp Icon<br/>Amount Display]
end
TotalOrders --> OrderCard[Blue Background]
PendingOrders --> PendingCard[Yellow Background]
Revenue --> RevenueCard[Green Background]
AvgValue --> AvgCard[Purple Background]
```

**Diagram sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L130-L200)

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L130-L200)

## Accessibility Features

The Restaurant Dashboard incorporates comprehensive accessibility features to ensure usability for all users, including those relying on assistive technologies.

### Keyboard Navigation Support

The dashboard provides full keyboard navigation support with proper focus management and logical tab ordering.

### ARIA Labels and Roles

Critical components utilize appropriate ARIA labels and roles to enhance screen reader compatibility and improve user experience for assistive technology users.

### Focus Management

The system implements proper focus management patterns that guide users through interactive elements in a logical sequence while maintaining context awareness.

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L1-L370)
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)

## Responsive Design Implementation

The dashboard follows a desktop-first responsive design approach with intelligent breakpoint management that ensures optimal user experience across all device sizes.

### Breakpoint Strategy

The responsive implementation uses Tailwind CSS utilities to create adaptive layouts that scale gracefully from desktop to mobile devices.

### Mobile Adaptations

While primarily designed for desktop use, the dashboard maintains functionality and readability on mobile devices through strategic layout adjustments and component scaling.

**Section sources**
- [layout.tsx](file://src/app/layout.tsx#L1-L70)

## State Management

The Restaurant Dashboard implements a centralized state management approach that synchronizes data between components and maintains consistency across the user interface.

### State Synchronization

The dashboard maintains synchronization between restaurant data, menu items, and order status through prop drilling and state propagation patterns.

### Local State Management

Components utilize React's useState hook for local state management while coordinating with parent components for global state coordination.

**Section sources**
- [restaurant-app.tsx](file://src/components/restaurant/restaurant-app.tsx#L1-L134)
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L1-L370)

## Navigation and Workflow

The dashboard integrates seamlessly with the broader MenuPRO application flow, providing clear navigation paths and logical progression through the restaurant setup and management workflow.

### Logout Functionality

The handleLogout function provides secure session termination and redirects users to the onboarding screen while clearing stored authentication data.

### Navigation Shortcuts

The system includes navigation shortcuts that allow users to quickly return to previous setup steps or access key administrative functions.

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L1-L370)
- [restaurant-app.tsx](file://src/components/restaurant/restaurant-app.tsx#L1-L134)

## Future Integration Points

The Restaurant Dashboard includes several placeholder areas and integration points designed for future expansion and enhancement of functionality.

### Order Updates Integration

The system is designed to accommodate real-time order updates through WebSocket connections or polling mechanisms, though these are not yet implemented.

### Analytics Enhancement

Placeholder areas for analytics dashboards indicate planned integration with advanced reporting and business intelligence tools.

### Menu Management Expansion

The menu management system includes hooks for future integration with inventory management and pricing optimization tools.

**Section sources**
- [restaurant-dashboard.tsx](file://src/components/restaurant/restaurant-dashboard.tsx#L1-L370)

## Troubleshooting Guide

Common issues and their resolutions when working with the Restaurant Dashboard UI.

### QR Code Generation Issues

- **Problem**: QR codes fail to generate
- **Solution**: Verify API endpoint connectivity and check server-side QR code generation logs

### Order Status Updates

- **Problem**: Order status changes don't persist
- **Solution**: Ensure proper API integration and verify authentication tokens

### Menu Upload Failures

- **Problem**: Menu parsing fails or produces incorrect results
- **Solution**: Check image quality for physical menu uploads and verify PDF formatting for text parsing

**Section sources**
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L45-L102)
- [menu-upload-screen.tsx](file://src/components/restaurant/menu-upload-screen.tsx#L50-L100)

## Conclusion

The Restaurant Dashboard UI represents a comprehensive solution for restaurant operators seeking efficient digital menu management and order processing capabilities. Built with modern React patterns and accessibility standards, the dashboard provides a robust foundation for restaurant operations while maintaining flexibility for future enhancements.

The modular architecture, responsive design, and comprehensive feature set position the dashboard as a central hub for restaurant management tasks, from order tracking to menu maintenance and QR code generation. The integration with external APIs and planned analytics capabilities ensure scalability and extensibility for growing restaurant operations.