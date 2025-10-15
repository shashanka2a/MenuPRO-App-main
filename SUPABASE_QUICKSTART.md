# 🚀 MenuPRO Supabase Quick Start

## ✅ What's Already Done

Your MenuPRO project now includes complete Supabase integration:

- ✅ **Supabase Client**: Configured with your credentials
- ✅ **Real-time Features**: Order updates and status changes
- ✅ **File Storage**: Menu images and QR codes
- ✅ **Authentication**: User management
- ✅ **Database Schema**: Prisma models ready for Supabase
- ✅ **Helper Classes**: Simplified API operations
- ✅ **React Hooks**: Real-time data hooks
- ✅ **Setup Scripts**: Automated configuration

## 🔧 Next Steps (Required)

### 1. Create Environment File

Create `.env.local` in your project root:

```bash
# Database - Supabase
DATABASE_URL="postgresql://postgres:g8Ja7gvfJxLo6vg0@db.isletdfyulyiicpopcoq.supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://isletdfyulyiicpopcoq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbGV0ZGZ5dWx5aWljcG9wY29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTg1MTUsImV4cCI6MjA3NjEzNDUxNX0.cYRyyf1oanH4ezfZJDfMKPh0KcQo57VwsADuywuMkaA"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Other required variables
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
EMAIL_FROM="noreply@menupro.app"
EMAIL_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
QR_CODE_BASE_URL="https://menupro.app/order"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NODE_ENV="development"
```

### 2. Get Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/isletdfyulyiicpopcoq)
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (not the anon key)
4. Replace `your-service-role-key-here` in `.env.local`

### 3. Push Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Test Integration

```bash
# Test all Supabase features
npm run supabase:test

# Run the app
npm run dev
```

## 🎯 Key Features Available

### Real-time Order Updates
```typescript
import { useRealtimeOrders } from '@/lib/supabase-integration'

const { orders, loading } = useRealtimeOrders(restaurantId)
```

### File Uploads
```typescript
import { SupabaseIntegration } from '@/lib/supabase-integration'

const { url } = await SupabaseIntegration.uploadMenuImage(file, restaurantId, menuItemId)
```

### Authentication
```typescript
import { supabase } from '@/lib/supabase'

const { user, error } = await supabase.auth.signInWithPassword({ email, password })
```

## 📊 Supabase Dashboard

Access your project at: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq

- **Database**: View and manage your data
- **Authentication**: Manage users and policies
- **Storage**: Upload and manage files
- **API**: View auto-generated API docs
- **Logs**: Monitor real-time activity

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check if Supabase is accessible
curl https://isletdfyulyiicpopcoq.supabase.co/rest/v1/

# Test database connection
npm run supabase:test
```

### Environment Variables
```bash
# Verify environment variables are loaded
echo $DATABASE_URL
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Common Issues
1. **"Can't reach database server"**: Check your internet connection and Supabase status
2. **"Table not found"**: Run `npm run db:push` to create tables
3. **"Invalid API key"**: Verify your service role key in Supabase dashboard

## 🎉 You're Ready!

Once you complete the steps above, your MenuPRO app will have:

- ✅ **Real-time order updates**
- ✅ **File storage for images**
- ✅ **User authentication**
- ✅ **Live dashboard updates**
- ✅ **Production-ready database**

## 📚 Documentation

- **Full Setup Guide**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **API Reference**: [API Reference](./repowiki/content/API%20Reference/)
- **Architecture**: [Backend Architecture](./repowiki/content/Backend%20Architecture/)

## 🆘 Need Help?

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the [MenuPRO Documentation](./repowiki/)
3. Test individual components with `npm run supabase:test`

Your Supabase integration is ready to power MenuPRO's real-time features! 🚀
