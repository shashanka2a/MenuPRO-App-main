# UI Component Library

<cite>
**Referenced Files in This Document**   
- [button.tsx](file://src/components/ui/button.tsx)
- [input.tsx](file://src/components/ui/input.tsx)
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [sheet.tsx](file://src/components/ui/sheet.tsx)
- [form.tsx](file://src/components/ui/form.tsx)
- [utils.ts](file://src/components/ui/utils.ts)
- [use-mobile.ts](file://src/components/ui/use-mobile.ts)
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx)
- [order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx)
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx)
- [card.tsx](file://src/components/ui/card.tsx)
- [badge.tsx](file://src/components/ui/badge.tsx)
- [accordion.tsx](file://src/components/ui/accordion.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Components](#core-components)
3. [Accessibility and Keyboard Navigation](#accessibility-and-keyboard-navigation)
4. [Responsive Behavior and Mobile Detection](#responsive-behavior-and-mobile-detection)
5. [Form Integration and Validation](#form-integration-and-validation)
6. [Modal and Sheet Components](#modal-and-sheet-components)
7. [Theming and Customization](#theming-and-customization)
8. [Performance Considerations](#performance-considerations)
9. [Component Extension Guidelines](#component-extension-guidelines)
10. [Usage Patterns in PWA and Restaurant Interfaces](#usage-patterns-in-pwa-and-restaurant-interfaces)

## Introduction
The UI component library is built on Radix UI primitives and styled with Tailwind CSS, providing a consistent, accessible, and responsive design system for both PWA and restaurant interfaces. The components are designed to ensure accessibility, keyboard navigation, and screen reader support while maintaining visual consistency across different device sizes and user interactions.

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)
- [input.tsx](file://src/components/ui/input.tsx#L1-L22)

## Core Components

The component library includes foundational UI elements such as Button, Input, Card, Badge, and Accordion, each built with accessibility and usability in mind. These components leverage Radix UI's unstyled primitives combined with Tailwind CSS for styling, ensuring maximum flexibility and consistency.

### Button Component
The Button component supports multiple variants (default, destructive, outline, secondary, ghost, link) and sizes (default, sm, lg, icon). It uses `class-variance-authority` for variant management and includes focus states, disabled states, and accessibility attributes.

```mermaid
classDiagram
class Button {
+variant : "default"|"destructive"|"outline"|"secondary"|"ghost"|"link"
+size : "default"|"sm"|"lg"|"icon"
+asChild : boolean
+className : string
}
```

**Diagram sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)

### Input Component
The Input component provides styled text inputs with focus states, error states, and disabled states. It includes built-in accessibility features such as proper labeling and ARIA attributes for screen readers.

```mermaid
classDiagram
class Input {
+type : string
+className : string
+disabled : boolean
+placeholder : string
}
```

**Diagram sources**
- [input.tsx](file://src/components/ui/input.tsx#L1-L22)

### Card Component
The Card component serves as a container for related content, with structured sections for header, title, description, content, footer, and action elements. It provides a consistent layout pattern across the application.

```mermaid
classDiagram
class Card {
+className : string
}
class CardHeader {
+className : string
}
class CardTitle {
+className : string
}
class CardDescription {
+className : string
}
class CardContent {
+className : string
}
class CardFooter {
+className : string
}
class CardAction {
+className : string
}
Card --> CardHeader
Card --> CardContent
Card --> CardFooter
CardHeader --> CardTitle
CardHeader --> CardDescription
CardHeader --> CardAction
```

**Diagram sources**
- [card.tsx](file://src/components/ui/card.tsx#L1-L93)

### Badge Component
The Badge component displays small status indicators or labels with different variants (default, secondary, destructive, outline) for various use cases such as status tags or category labels.

```mermaid
classDiagram
class Badge {
+variant : "default"|"secondary"|"destructive"|"outline"
+asChild : boolean
+className : string
}
```

**Diagram sources**
- [badge.tsx](file://src/components/ui/badge.tsx#L1-L47)

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)
- [input.tsx](file://src/components/ui/input.tsx#L1-L22)
- [card.tsx](file://src/components/ui/card.tsx#L1-L93)
- [badge.tsx](file://src/components/ui/badge.tsx#L1-L47)

## Accessibility and Keyboard Navigation

All components in the library are built with accessibility as a core principle, leveraging Radix UI's accessible primitives. Components include proper ARIA attributes, keyboard navigation support, and screen reader optimizations.

### Focus Management
Components implement visible focus indicators through Tailwind classes like `focus-visible:border-ring` and `focus-visible:ring-ring/50`. The focus ring is applied only when users navigate with keyboards, maintaining a clean appearance for mouse users.

### Screen Reader Support
Interactive elements include appropriate ARIA roles and states. For example, the Dialog and Sheet components include `sr-only` text for screen readers, such as the "Close" label on close buttons.

### Keyboard Navigation
Radix UI primitives ensure proper keyboard navigation patterns:
- Tab navigation through interactive elements
- Escape key to close dialogs and sheets
- Arrow key navigation within composite components like Accordion

```mermaid
sequenceDiagram
participant User
participant Component
participant ScreenReader
User->>Component : Tab key press
Component->>Component : Move focus to next interactive element
Component->>ScreenReader : Announce focused element
User->>Component : Enter/Space on Button
Component->>Component : Trigger button action
Component->>ScreenReader : Announce action result
User->>Component : Escape key in Dialog
Component->>Component : Close dialog
Component->>ScreenReader : Announce dialog closed
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L136)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L1-L140)
- [accordion.tsx](file://src/components/ui/accordion.tsx#L1-L67)

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L136)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L1-L140)
- [accordion.tsx](file://src/components/ui/accordion.tsx#L1-L67)

## Responsive Behavior and Mobile Detection

The component library includes utilities for responsive behavior and mobile device detection to ensure optimal user experience across different screen sizes.

### useIsMobile Hook
The `use-mobile.ts` utility provides a React hook that detects mobile devices based on screen width, using a breakpoint of 768px.

```mermaid
flowchart TD
Start([Component Mount]) --> CheckWidth["window.innerWidth < 768"]
CheckWidth --> |True| SetMobile["isMobile = true"]
CheckWidth --> |False| SetDesktop["isMobile = false"]
SetMobile --> AddListener["Add resize event listener"]
SetDesktop --> AddListener
AddListener --> Wait["Wait for window resize"]
Wait --> CheckWidth
style Start fill:#f9f,stroke:#333
style SetMobile fill:#bbf,stroke:#333
style SetDesktop fill:#bbf,stroke:#333
```

**Diagram sources**
- [use-mobile.ts](file://src/components/ui/use-mobile.ts#L1-L22)

### Responsive Design Patterns
Components use Tailwind's responsive prefixes (sm:, md:, lg:) to adapt layouts:
- Mobile-first design approach
- Stack content vertically on small screens
- Use larger tap targets on touch devices
- Adjust spacing and typography for readability

**Section sources**
- [use-mobile.ts](file://src/components/ui/use-mobile.ts#L1-L22)

## Form Integration and Validation

The form system is built on react-hook-form with custom UI components that provide seamless integration between form state and visual feedback.

### Form Component Structure
The form components follow a structured pattern with Form, FormItem, FormLabel, FormControl, FormDescription, and FormMessage components that work together to create accessible forms.

```mermaid
classDiagram
class Form {
+children : ReactNode
}
class FormItem {
+children : ReactNode
}
class FormLabel {
+children : ReactNode
}
class FormControl {
+children : ReactNode
}
class FormDescription {
+children : ReactNode
}
class FormMessage {
+children : ReactNode
}
Form --> FormItem
FormItem --> FormLabel
FormItem --> FormControl
FormItem --> FormDescription
FormItem --> FormMessage
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L169)

### Email Verification Example
The email verification screen demonstrates form integration with validation, loading states, and error handling.

```mermaid
flowchart TD
Start([Form Submit]) --> Validate["Validate Email Format"]
Validate --> |Invalid| ShowError["Show Error Message"]
Validate --> |Valid| SetLoading["Set Loading State"]
SetLoading --> API["Call API to Send Verification"]
API --> |Success| ShowSuccess["Show Success State"]
API --> |Error| ShowNetworkError["Show Network Error"]
ShowSuccess --> StoreEmail["Store Email in localStorage"]
ShowSuccess --> RenderSuccessView["Render Success View"]
style Start fill:#f9f,stroke:#333
style ShowError fill:#f96,stroke:#333
style ShowSuccess fill:#6f9,stroke:#333
```

**Diagram sources**
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx#L1-L194)
- [form.tsx](file://src/components/ui/form.tsx#L1-L169)

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L169)
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx#L1-L194)

## Modal and Sheet Components

The library provides two types of overlay components: Dialog (modal) and Sheet (sliding panel), each with accessibility features and animation support.

### Dialog Component
The Dialog component creates a modal overlay with a backdrop, content area, and close functionality. It uses Radix UI's Dialog primitive with custom styling.

```mermaid
classDiagram
class Dialog {
+open : boolean
+onOpenChange : function
}
class DialogTrigger {
+children : ReactNode
}
class DialogPortal {
+children : ReactNode
}
class DialogOverlay {
+className : string
}
class DialogContent {
+className : string
+children : ReactNode
}
class DialogHeader {
+className : string
+children : ReactNode
}
class DialogFooter {
+className : string
+children : ReactNode
}
class DialogTitle {
+className : string
+children : ReactNode
}
class DialogDescription {
+className : string
+children : ReactNode
}
Dialog --> DialogTrigger
Dialog --> DialogPortal
DialogPortal --> DialogOverlay
DialogPortal --> DialogContent
DialogContent --> DialogHeader
DialogContent --> DialogFooter
DialogHeader --> DialogTitle
DialogHeader --> DialogDescription
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L136)

### Sheet Component
The Sheet component provides a sliding panel that can appear from any edge of the screen (top, right, bottom, left), making it ideal for mobile interfaces.

```mermaid
classDiagram
class Sheet {
+open : boolean
+onOpenChange : function
}
class SheetTrigger {
+children : ReactNode
}
class SheetPortal {
+children : ReactNode
}
class SheetOverlay {
+className : string
}
class SheetContent {
+side : "top"|"right"|"bottom"|"left"
+className : string
+children : ReactNode
}
class SheetHeader {
+className : string
+children : ReactNode
}
class SheetFooter {
+className : string
+children : ReactNode
}
class SheetTitle {
+className : string
+children : ReactNode
}
class SheetDescription {
+className : string
+children : ReactNode
}
Sheet --> SheetTrigger
Sheet --> SheetPortal
SheetPortal --> SheetOverlay
SheetPortal --> SheetContent
SheetContent --> SheetHeader
SheetContent --> SheetFooter
SheetHeader --> SheetTitle
SheetHeader --> SheetDescription
```

**Diagram sources**
- [sheet.tsx](file://src/components/ui/sheet.tsx#L1-L140)

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L136)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L1-L140)

## Theming and Customization

The component library supports theming and customization through Tailwind CSS classes and variant system.

### Theme Variables
The styling system uses CSS variables defined in the global stylesheet, allowing for easy theme customization:
- Color palette (primary, secondary, destructive, etc.)
- Typography scales
- Spacing system
- Border radii
- Shadow levels

### Customization Options
Components can be customized through:
- Standard Tailwind utility classes
- Component-specific variants
- className prop for additional styling
- asChild prop to preserve child component styles

### Utility Functions
The `utils.ts` file provides a `cn()` function that combines `clsx` and `tailwind-merge` to properly merge Tailwind classes without conflicts.

```mermaid
flowchart LR
A["Component className"] --> C["cn() utility"]
B["Variant classes"] --> C
C --> D["Merged classes"]
D --> E["Rendered component"]
style A fill:#bbf,stroke:#333
style B fill:#bbf,stroke:#333
style C fill:#f96,stroke:#333
style D fill:#6f9,stroke:#333
```

**Diagram sources**
- [utils.ts](file://src/components/ui/utils.ts#L1-L7)
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)

**Section sources**
- [utils.ts](file://src/components/ui/utils.ts#L1-L7)
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)

## Performance Considerations

The component library is designed with performance in mind, especially for rendering large lists such as menu items.

### Efficient Rendering
- Components use React.memo where appropriate
- Event handlers are properly memoized
- Heavy computations are avoided in render methods
- Virtualization can be implemented for large lists

### Bundle Size Optimization
- Tree-shakable exports via index.ts
- Only import needed components
- Code splitting for large components
- Lazy loading of non-critical components

### Memory Management
- Proper cleanup of event listeners
- Avoid memory leaks in useEffect hooks
- Efficient state management

**Section sources**
- [index.ts](file://src/components/ui/index.ts#L1-L6)

## Component Extension Guidelines

When extending components, maintain design system integrity by following these guidelines:

### Extension Patterns
- Use the asChild prop to wrap existing components
- Extend variants through the cva configuration
- Compose new components from existing primitives
- Maintain consistent spacing and typography

### Do's and Don'ts
- DO: Use existing color palette and spacing system
- DO: Maintain accessibility features
- DO: Follow naming conventions
- DON'T: Override base styles that affect global consistency
- DON'T: Remove accessibility attributes
- DON'T: Create redundant variants

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)
- [utils.ts](file://src/components/ui/utils.ts#L1-L7)

## Usage Patterns in PWA and Restaurant Interfaces

The components are used consistently across both PWA and restaurant interfaces, with specific patterns for different contexts.

### PWA Interface Patterns
The PWA interfaces use components to create user-friendly ordering experiences:

#### Email Verification Flow
The email verification screen uses Card, Input, and Button components to collect user email with validation.

```mermaid
flowchart TD
A["Email Verification Screen"] --> B["Card Container"]
B --> C["Input with Mail Icon"]
B --> D["Submit Button"]
B --> E["Error State"]
B --> F["Success State"]
style A fill:#f9f,stroke:#333
style B fill:#bbf,stroke:#333
```

**Diagram sources**
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx#L1-L194)

#### Order Confirmation Flow
The order confirmation screen uses Badge, Card, and Button components to display order status and next steps.

```mermaid
flowchart TD
A["Order Confirmation Screen"] --> B["Success Card"]
B --> C["CheckCircle Icon"]
B --> D["Order Number Badge"]
B --> E["Estimated Time Display"]
A --> F["Action Buttons"]
F --> G["Notify Staff Button"]
F --> H["Order More Button"]
F --> I["Back Button"]
style A fill:#f9f,stroke:#333
style B fill:#bbf,stroke:#333
style F fill:#bbf,stroke:#333
```

**Diagram sources**
- [order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx#L1-L154)

### Restaurant Interface Patterns
The restaurant interfaces use components for management tasks:

#### Table QR Code Management
The table QR screen uses Input, Button, Badge, and Card components to generate and manage QR codes for tables.

```mermaid
flowchart TD
A["Table QR Screen"] --> B["Configuration Card"]
B --> C["Number of Tables Input"]
B --> D["Generate Button"]
A --> E["Table List"]
E --> F["Table Card"]
F --> G["QR Code Image"]
F --> H["Table Number Badge"]
F --> I["Action Buttons"]
I --> J["Download Button"]
I --> K["Print Button"]
I --> L["Copy Button"]
style A fill:#f9f,stroke:#333
style B fill:#bbf,stroke:#333
style E fill:#bbf,stroke:#333
```

**Diagram sources**
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L1-L515)

**Section sources**
- [email-verification-screen.tsx](file://src/components/pwa/email-verification-screen.tsx#L1-L194)
- [order-confirmation-screen.tsx](file://src/components/pwa/order-confirmation-screen.tsx#L1-L154)
- [table-qr-screen.tsx](file://src/components/restaurant/table-qr-screen.tsx#L1-L515)