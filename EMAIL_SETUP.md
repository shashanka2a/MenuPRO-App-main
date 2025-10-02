# Email Verification Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

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

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to Security → 2-Step Verification
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
- In your Google Account settings, go to Security
- Under "2-Step Verification", click on "App passwords"
- Select "Mail" as the app and "Other" as the device
- Enter "MenuPRO" as the device name
- Copy the generated 16-character password
- Use this password as `GMAIL_APP_PASSWORD` in your `.env.local`

### 3. Update Environment Variables
Replace the placeholder values in your `.env.local`:
- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: The 16-character app password from step 2
- `JWT_SECRET`: A strong, random secret key (use a password generator)
- `NEXTAUTH_SECRET`: Another strong, random secret key

## Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to the PWA app
3. Go through the QR scan flow
4. Enter your email address
5. Check your email for the verification code
6. Enter the code to complete verification

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Consider using a dedicated email service (SendGrid, AWS SES) for production
- Implement rate limiting for email sending
- Add proper error handling and logging

## Production Considerations

- Use a proper database (PostgreSQL, MongoDB) instead of in-memory storage
- Implement Redis for OTP storage with expiration
- Add email templates and branding
- Implement proper logging and monitoring
- Add rate limiting and abuse prevention
- Use a dedicated email service provider
