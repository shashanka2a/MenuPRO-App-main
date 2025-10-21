import { execSync } from 'child_process'

console.log(`
🚀 Supabase Project Setup Guide

The current Supabase project appears to be inactive or doesn't exist.
Here's how to set up a new Supabase project:

📋 STEP 1: Create New Supabase Project
1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: MenuOS
   - Database Password: [generate a strong password]
   - Region: Choose closest to your users
5. Click "Create new project"

📋 STEP 2: Get Database Credentials
Once your project is created:
1. Go to Settings → Database
2. Copy the connection string
3. It should look like:
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

📋 STEP 3: Update Environment Variables
Create a .env.local file with:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

📋 STEP 4: Run Database Setup
After updating credentials, run:
npm run db:push-supabase

🔗 Current Project Details (if you want to check):
- Project URL: https://isletdfyulyiicpopcoq.supabase.co
- Database URL: postgresql://postgres:g8Ja7gvfJxLo6vg0@db.isletdfyulyiicpopcoq.supabase.co:5432/postgres

⚠️  The current project appears to be inactive or doesn't exist.
`)

// Try to open Supabase dashboard
try {
  console.log('🌐 Opening Supabase dashboard...')
  execSync('open https://supabase.com/dashboard', { stdio: 'ignore' })
} catch (error) {
  console.log('📱 Please manually open: https://supabase.com/dashboard')
}

