# Environment Configuration

<cite>
**Referenced Files in This Document**
- [next.config.js](file://next.config.js)
- [tailwind.config.ts](file://tailwind.config.ts)
- [tsconfig.json](file://tsconfig.json)
- [jest.config.js](file://jest.config.js)
- [package.json](file://package.json)
- [EMAIL_SETUP.md](file://EMAIL_SETUP.md)
- [README.md](file://README.md)
- [SEO_STRATEGY.md](file://SEO_STRATEGY.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Configuration Files](#configuration-files)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Development Environment Setup](#development-environment-setup)
6. [Testing Configuration](#testing-configuration)
7. [Deployment Configuration](#deployment-configuration)
8. [Common Configuration Issues](#common-configuration-issues)
9. [Best Practices](#best-practices)
10. [Troubleshooting Guide](#troubleshooting-guide)

## Introduction

MenuPRO-App-main is a modern restaurant menu management and ordering system built with Next.js 14, TypeScript, and Tailwind CSS. This comprehensive guide covers all aspects of environment configuration, from development setup to production deployment, ensuring optimal performance across different environments.

The application requires careful configuration of environment variables, build settings, and deployment parameters to function correctly. This documentation provides step-by-step instructions for setting up the development environment, configuring production deployments, and troubleshooting common configuration issues.

## Project Overview

MenuPRO is a sophisticated web application designed for restaurant digital menu management and ordering. The project utilizes cutting-edge technologies including:

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI for accessible components
- **Icons**: Lucide React for modern iconography
- **State Management**: React hooks and context APIs

The application consists of multiple components including a landing page, Progressive Web App (PWA) functionality, and restaurant management interfaces. Each component requires specific configuration settings for optimal operation.

**Section sources**
- [README.md](file://README.md#L1-L93)

## Configuration Files

### Next.js Configuration (next.config.js)

The Next.js configuration file controls the build process, image optimization, and TypeScript settings. The current configuration is optimized for development and static export scenarios.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Empty array for development, populated for production
    unoptimized: true, // For static exports if needed
  },
  typescript: {
    ignoreBuildErrors: false, // Strict TypeScript checking during builds
  },
  eslint: {
    ignoreDuringBuilds: false, // Enforce ESLint during builds
  },
}
```

**Key Configuration Details:**
- **Image Optimization**: Disabled for development, can be enabled for production
- **TypeScript**: Strict mode enabled for reliable builds
- **ESLint**: Enforced during builds to maintain code quality
- **Static Export**: Unoptimized images for development simplicity

**Section sources**
- [next.config.js](file://next.config.js#L1-L16)

### Tailwind CSS Configuration (tailwind.config.ts)

The Tailwind configuration defines design tokens, color schemes, and component customizations. The configuration supports CSS custom properties for dynamic theming.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        // ... additional color definitions
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
```

**Configuration Highlights:**
- **Content Paths**: Scans all relevant source directories for Tailwind classes
- **CSS Custom Properties**: Uses CSS variables for dynamic theming support
- **Color System**: Extends with semantic color groups
- **Border Radius**: Consistent sizing system with CSS custom properties

**Section sources**
- [tailwind.config.ts](file://tailwind.config.ts#L1-L68)

### TypeScript Configuration (tsconfig.json)

The TypeScript configuration ensures proper compilation and type checking across the entire codebase.

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "noImplicitAny": false,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["components/*"],
      "@ui/*": ["components/ui/*"]
    }
  }
}
```

**Key Settings:**
- **Target**: ES5 for broad browser compatibility
- **Strict Mode**: Disabled for flexibility in development
- **Path Mapping**: Enables clean import statements
- **Next.js Plugin**: Integrates with Next.js build system
- **Incremental Compilation**: Faster rebuilds during development

**Section sources**
- [tsconfig.json](file://tsconfig.json#L1-L43)

## Environment Variables Setup

### Essential Environment Variables

MenuPRO requires several critical environment variables for proper functionality, particularly for email verification and authentication.

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# JWT Secret (use a strong secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### Environment Variable Categories

#### 1. Email Configuration
- **GMAIL_USER**: Your Gmail address for email verification
- **GMAIL_APP_PASSWORD**: 16-character app password from Google
- **SMTP_HOST**: Optional SMTP server host (for production)
- **SMTP_PORT**: Optional SMTP port (default: 587)
- **SMTP_USERNAME**: Optional SMTP username
- **SMTP_PASSWORD**: Optional SMTP password

#### 2. Authentication Configuration
- **JWT_SECRET**: Strong secret key for JWT token generation
- **NEXTAUTH_SECRET**: Secret for NextAuth.js sessions
- **NEXTAUTH_URL**: Base URL for authentication callbacks
- **NEXTAUTH_PROVIDERS**: Optional OAuth providers configuration

#### 3. Application Configuration
- **NODE_ENV**: Environment identifier (development, production, test)
- **PORT**: Port number for the application (default: 3000)
- **DATABASE_URL**: Optional database connection string
- **REDIS_URL**: Optional Redis connection for session storage

### Gmail Setup Process

To configure Gmail SMTP for email verification:

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2-Factor Authentication if not already enabled

2. **Generate App Password**
   - In Google Account settings, go to Security
   - Click on "App passwords" under 2-Step Verification
   - Select "Mail" as the app and "Other" as the device
   - Enter "MenuPRO" as the device name
   - Copy the generated 16-character password

3. **Update Environment Variables**
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=generated-app-password
   JWT_SECRET=strong-random-secret-key
   NEXTAUTH_SECRET=another-strong-secret-key
   ```

**Section sources**
- [EMAIL_SETUP.md](file://EMAIL_SETUP.md#L1-L67)

## Development Environment Setup

### Prerequisites

Before setting up the development environment, ensure you have the following prerequisites:

- **Node.js 18+**: Minimum required version for Next.js 14 compatibility
- **npm or yarn**: Package manager for dependency installation
- **Git**: Version control system for source code management
- **Code Editor**: VS Code, WebStorm, or equivalent IDE

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-repository/MenuPRO-App-main.git
cd MenuPRO-App-main
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
# Development Environment
GMAIL_USER=your-dev-email@gmail.com
GMAIL_APP_PASSWORD=your-dev-app-password
JWT_SECRET=development-jwt-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-nextauth-secret
```

#### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

#### 5. Verify Setup
Open http://localhost:3000 in your browser and verify:
- Application loads correctly
- Email verification functionality works
- PWA features are operational
- Navigation between pages is smooth

### Development Scripts

The project includes several useful development scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Script Descriptions:**
- **dev**: Starts the development server with hot reloading
- **build**: Creates an optimized production build
- **start**: Runs the production server
- **lint**: Executes ESLint for code quality checks
- **test**: Runs the Jest test suite
- **test:watch**: Continuously runs tests during development
- **test:coverage**: Generates test coverage reports

**Section sources**
- [package.json](file://package.json#L60-L68)
- [README.md](file://README.md#L25-L45)

## Testing Configuration

### Jest Configuration (jest.config.js)

The testing configuration integrates with Next.js and provides comprehensive test setup for the application.

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
}
```

### Test Configuration Features

#### 1. Module Resolution
- **Path Mapping**: Supports `@/`, `@ui/`, and `@components/` aliases
- **JSX Support**: Handles React JSX syntax in tests
- **TypeScript**: Compiles TypeScript files for testing

#### 2. Environment Setup
- **jsdom**: Simulates browser environment for DOM manipulation
- **Custom Setup**: Loads `jest.setup.js` for global test configuration
- **Isolation**: Tests run in isolated environments

#### 3. Coverage Collection
- **Source Tracking**: Monitors all source files except stories and declarations
- **Exclusions**: Ignores TypeScript declaration files and storybook components
- **Reporting**: Generates detailed coverage reports

### Running Tests

Execute tests using the configured scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

### Test Organization

The project follows a structured test organization:

```
src/__tests__/
├── customer/           # Customer-facing component tests
├── integration/        # Integration tests
├── restaurant/         # Restaurant management tests
└── test-utils.tsx     # Shared test utilities
```

**Section sources**
- [jest.config.js](file://jest.config.js#L1-L27)

## Deployment Configuration

### Vercel Deployment

MenuPRO is optimized for Vercel deployment with minimal configuration requirements.

#### Vercel Configuration Options

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

#### Environment Variables for Vercel

Set the following environment variables in Vercel dashboard:

- **GMAIL_USER**: Production Gmail account
- **GMAIL_APP_PASSWORD**: Production app password
- **JWT_SECRET**: Production-strength JWT secret
- **NEXTAUTH_URL**: Production base URL
- **NEXTAUTH_SECRET**: Production NextAuth secret

#### Deployment Steps

1. **Connect GitHub Repository**
   - Connect your GitHub repository to Vercel
   - Select the MenuPRO-App-main branch

2. **Configure Environment Variables**
   - Set all required environment variables
   - Configure domain settings

3. **Deploy Application**
   - Trigger manual deployment or enable automatic deployments
   - Monitor deployment logs for any configuration issues

### AWS Deployment

For AWS deployment, configure the following services:

#### EC2 Instance Configuration
- **AMI**: Amazon Linux 2 or Ubuntu LTS
- **Instance Type**: t3.medium or larger for production
- **Security Groups**: Allow HTTP (80), HTTPS (443), and SSH (22)
- **Elastic IP**: Assign static IP for production access

#### Environment Variables for AWS

```bash
# Production Environment
NODE_ENV=production
PORT=3000
GMAIL_USER=production-email@example.com
GMAIL_APP_PASSWORD=production-app-password
JWT_SECRET=production-jwt-secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production-nextauth-secret
```

#### Deployment Pipeline

1. **EC2 Setup**
   ```bash
   # Update system packages
   sudo yum update -y
   
   # Install Node.js
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   
   # Deploy application
   git clone https://github.com/your-repository/MenuPRO-App-main.git
   cd MenuPRO-App-main
   npm install
   npm run build
   ```

2. **Process Management**
   ```bash
   # Install PM2 for process management
   npm install pm2 -g
   pm2 start npm --name "menupro" -- start
   pm2 save
   pm2 startup
   ```

3. **Reverse Proxy Configuration**
   ```nginx
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
   }
   ```

### Static Export Configuration

For static site deployment, modify the Next.js configuration:

```javascript
const nextConfig = {
  // Enable static export
  output: 'export',
  
  // Disable image optimization for static builds
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slash for static URLs
  trailingSlash: true,
}
```

## Common Configuration Issues

### 1. Environment Variable Loading

**Problem**: Environment variables not loading in development or production.

**Solution**:
```bash
# Ensure .env.local file exists in project root
ls -la .env.local

# Verify file permissions
chmod 600 .env.local

# Restart development server
npm run dev
```

### 2. Email Verification Issues

**Problem**: Email verification emails not sending or failing.

**Debugging Steps**:
```javascript
// Add logging to email verification endpoint
console.log('Sending verification email to:', email);
console.log('Using SMTP settings:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465'
});
```

### 3. TypeScript Compilation Errors

**Problem**: TypeScript errors preventing successful builds.

**Solutions**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix strict mode issues
# Update tsconfig.json:
{
  "strict": false,
  "noImplicitAny": false
}

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### 4. Jest Test Failures

**Problem**: Tests failing due to configuration issues.

**Debugging Approach**:
```bash
# Run tests with verbose output
npm test -- --verbose

# Check module resolution
npm test -- --no-cache

# Verify test environment
npm test -- --env=jsdom
```

### 5. Build Performance Issues

**Problem**: Slow build times affecting development productivity.

**Optimization Strategies**:
```javascript
// Optimize Next.js configuration
const nextConfig = {
  // Enable incremental static regeneration
  experimental: {
    incrementalCacheHandlerPath: './cache-handler.js',
  },
  
  // Optimize image loading
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

## Best Practices

### 1. Environment Variable Management

**Secure Storage**:
- Never commit `.env*` files to version control
- Use environment-specific files (.env.development, .env.production)
- Implement proper secrets management for production

**Validation**:
```javascript
// Environment validation
const requiredEnvVars = ['GMAIL_USER', 'JWT_SECRET', 'NEXTAUTH_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}
```

### 2. Configuration Versioning

**Version Control Strategy**:
```bash
# Create template files
cp .env.example .env.local
cp next.config.js.example next.config.js

# Add to .gitignore
echo ".env.local" >> .gitignore
echo "*.local" >> .gitignore
```

### 3. Production Configuration

**Optimized Settings**:
```javascript
// Production Next.js configuration
const nextConfig = {
  // Enable production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Optimize images for production
  images: {
    domains: ['your-production-domain.com'],
  },
  
  // Enable static HTML export
  output: 'export',
}
```

### 4. Monitoring and Logging

**Implementation**:
```javascript
// Environment-aware logging
const logger = {
  info: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[INFO]', ...args);
    }
  },
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG]', ...args);
    }
  }
};
```

## Troubleshooting Guide

### Development Issues

#### Issue: Hot Reload Not Working
**Symptoms**: Changes not reflecting in browser after saving files.

**Diagnosis**:
```bash
# Check file watching limits
cat /proc/sys/fs/inotify/max_user_watches

# Verify Next.js configuration
grep -r "dev" next.config.js
```

**Solutions**:
```bash
# Increase file watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Restart development server
npm run dev
```

#### Issue: Memory Leaks During Development
**Symptoms**: Increasing memory usage and eventual crashes.

**Solutions**:
```bash
# Enable memory profiling
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Clear Next.js cache
rm -rf .next/cache
```

### Build Issues

#### Issue: Build Fails with TypeScript Errors
**Diagnostic Commands**:
```bash
# Check TypeScript version
npx tsc --version

# Run TypeScript compiler
npx tsc --noEmit

# Check for conflicting dependencies
npm ls typescript
```

**Fixes**:
```bash
# Update TypeScript version
npm install typescript@latest --save-dev

# Resolve dependency conflicts
npm dedupe
```

#### Issue: Images Not Loading in Production
**Solutions**:
```javascript
// Update Next.js configuration
const nextConfig = {
  images: {
    domains: ['your-production-domain.com', 'cdn.yourdomain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-production-domain.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}
```

### Runtime Issues

#### Issue: Authentication Problems
**Debugging Steps**:
```javascript
// Add authentication logging
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET length:', process.env.NEXTAUTH_SECRET?.length);

// Verify cookie settings
const cookies = document.cookie.split(';').map(c => c.trim());
console.log('Available cookies:', cookies);
```

#### Issue: Email Delivery Failures
**Monitoring Solution**:
```javascript
// Enhanced email logging
const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      code: error.code,
      response: error.response,
      command: error.command
    });
    throw error;
  }
};
```

### Performance Issues

#### Issue: Slow Page Load Times
**Optimization Checklist**:
```javascript
// Performance-optimized Next.js configuration
const nextConfig = {
  // Enable static optimization
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
  },
  
  // Configure webpack optimizations
  webpack(config) {
    config.optimization.minimizer = [];
    return config;
  },
  
  // Enable compression
  compress: true,
}
```

**Monitoring Tools**:
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer .next/build-stats.json

# Check performance metrics
npm run build -- --analyze
```

This comprehensive environment configuration guide ensures that MenuPRO-App-main can be successfully deployed and maintained across various environments while providing robust error handling and troubleshooting capabilities.