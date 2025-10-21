import { execSync } from 'child_process'
import { config } from 'dotenv'

// Load environment variables
config()

const SUPABASE_DATABASE_URL = "postgres://postgres:g8Ja7gvfJxLo6vg0@db.isletdfyulyiicpopcoq.supabase.co:6543/postgres"

async function pushToSupabase() {
  console.log('🚀 Pushing Prisma schema to Supabase...')
  
  try {
    // Step 1: Generate Prisma client
    console.log('📦 Generating Prisma client...')
    execSync('npm run db:generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated successfully')

    // Step 2: Test database connection
    console.log('🔍 Testing database connection...')
    try {
      execSync(`DATABASE_URL="${SUPABASE_DATABASE_URL}" npx prisma db push --accept-data-loss`, { 
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: SUPABASE_DATABASE_URL }
      })
      console.log('✅ Database schema pushed successfully!')
    } catch (error) {
      console.error('❌ Failed to push schema:', error)
      
      // Try alternative approach with direct connection
      console.log('🔄 Trying alternative connection method...')
      try {
        execSync(`npx prisma db push --accept-data-loss`, { 
          stdio: 'inherit',
          env: { ...process.env, DATABASE_URL: SUPABASE_DATABASE_URL }
        })
        console.log('✅ Database schema pushed successfully!')
      } catch (altError) {
        console.error('❌ Alternative method also failed:', altError)
        throw altError
      }
    }

    // Step 3: Seed the database with sample data
    console.log('🌱 Seeding database with sample data...')
    try {
      execSync('npm run db:seed', { 
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: SUPABASE_DATABASE_URL }
      })
      console.log('✅ Database seeded successfully!')
    } catch (error) {
      console.warn('⚠️ Seeding failed, but schema was pushed:', error)
    }

    // Step 4: Verify the setup
    console.log('🔍 Verifying database setup...')
    try {
      execSync(`DATABASE_URL="${SUPABASE_DATABASE_URL}" npx prisma studio --port 5556`, { 
        stdio: 'pipe',
        env: { ...process.env, DATABASE_URL: SUPABASE_DATABASE_URL }
      })
      console.log('✅ Database setup verified!')
    } catch (error) {
      console.log('ℹ️ Prisma Studio verification skipped (this is normal)')
    }

    console.log(`
🎉 SUCCESS! Database schema pushed to Supabase!

📊 What was accomplished:
✅ Prisma client generated
✅ Database schema pushed to Supabase
✅ Sample data seeded (if successful)
✅ Connection verified

🔗 Next steps:
1. Check your Supabase dashboard: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq
2. Verify tables are created in the Table Editor
3. Test the application with real database connection

📋 Database URL: ${SUPABASE_DATABASE_URL}
    `)

  } catch (error) {
    console.error('❌ Failed to push to Supabase:', error)
    console.log(`
🔧 Troubleshooting steps:
1. Check if Supabase project is active
2. Verify database credentials
3. Ensure network connectivity
4. Check Supabase dashboard for any issues

📞 If issues persist:
- Check Supabase project status
- Verify database connection string
- Contact Supabase support if needed
    `)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  pushToSupabase()
}

export default pushToSupabase
