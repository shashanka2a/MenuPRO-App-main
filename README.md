# MenuPRO - Next.js App

A modern restaurant menu management and ordering system built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Landing Page**: Beautiful marketing page showcasing the digital menu system
- **PWA Functionality**: Complete restaurant ordering experience with QR code scanning
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── pwa/              # PWA-specific components
│   ├── figma/            # Figma integration components
│   └── ...               # Feature components
└── styles/               # Additional styles
```

## Key Features

### Landing Page
- Hero section with call-to-action
- Features showcase
- Menu preview
- Customer testimonials
- Newsletter signup

### PWA Experience
- QR code scanning simulation
- Interactive menu browsing
- Shopping cart functionality
- Order customization
- Payment simulation

## Deployment

The app is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

```bash
npm run build
npm run start
```

## License

This project is private and proprietary.