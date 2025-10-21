# 🚀 Supabase Setup Guide for MenuOS

## ❌ Current Issue

The Supabase project `isletdfyulyiicpopcoq` appears to be inactive or doesn't exist. The hostname `db.isletdfyulyiicpopcoq.supabase.co` cannot be resolved.

## ✅ Solution: Create New Supabase Project

### Step 1: Create New Project

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Click "New Project"**
3. **Fill in project details**:
   - **Name**: `MenuOS`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. **Click "Create new project"**

### Step 2: Get Database Credentials

Once your project is created:

1. **Go to Settings → Database**
2. **Copy the connection string** (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
3. **Also copy the pooler connection**:
   ```
   postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres
   ```

### Step 3: Get API Keys

1. **Go to Settings → API**
2. **Copy these values**:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 4: Update Environment Variables

Create a `.env.local` file in your project root:

```bash
# Database - Supabase
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# Other required variables
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
EMAIL_FROM="noreply@menuos.app"
EMAIL_SERVICE="gmail"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
QR_CODE_BASE_URL="https://menuos.app/order"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NODE_ENV="development"
```

### Step 5: Update Scripts

After getting your new credentials, update the scripts:

1. **Update `scripts/push-schema.ts`**:
   ```typescript
   const SUPABASE_DATABASE_URL = "postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres"
   ```

2. **Update `scripts/test-connection.ts`**:
   ```typescript
   const SUPABASE_DATABASE_URL = "postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres"
   ```

### Step 6: Push Database Schema

After updating credentials, run:

```bash
npm run db:push-supabase
```

### Step 7: Seed Database

```bash
npm run db:seed
```

## 🔧 Alternative: Use Existing Project

If you have an existing Supabase project:

1. **Check project status** in Supabase dashboard
2. **Ensure project is not paused**
3. **Verify credentials are correct**
4. **Update connection strings** in scripts

## 📊 Expected Tables

After successful setup, you should see these tables in Supabase:

- `users` - User profiles and authentication
- `restaurants` - Restaurant information
- `menus` - Menu configurations
- `menu_items` - Individual menu items
- `tables` - Restaurant table management
- `orders` - Order tracking
- `order_items` - Order line items
- `analytics` - Performance metrics
- `otp_verifications` - Email verification

## 🚨 Troubleshooting

### Connection Issues
- Verify project exists and is active
- Check credentials are correct
- Ensure network connectivity
- Try both direct (5432) and pooler (6543) ports

### Permission Issues
- Ensure service role key has proper permissions
- Check Row Level Security (RLS) policies
- Verify database user permissions

## 📞 Support

If you continue having issues:
1. Check Supabase status page
2. Review Supabase documentation
3. Contact Supabase support
4. Verify project billing status

---

**Next Steps**: Once you have a working Supabase project, run `npm run db:push-supabase` to create all the database tables for MenuOS.

