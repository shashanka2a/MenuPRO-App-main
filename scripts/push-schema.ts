import { execSync } from 'child_process'

const SUPABASE_DATABASE_URL = "postgres://postgres:ETnpJs32ewdBtHhl@db.isletdfyulyiicpopcoq.supabase.co:6543/postgres"

function pushSchema() {
  console.log('🚀 Pushing Prisma schema to Supabase...')
  console.log(`📡 Database URL: ${SUPABASE_DATABASE_URL}`)
  
  try {
    // Step 1: Generate Prisma client
    console.log('\n📦 Step 1: Generating Prisma client...')
    execSync('npm run db:generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')

    // Step 2: Push schema to Supabase
    console.log('\n📤 Step 2: Pushing schema to Supabase...')
    execSync(`npx prisma db push --accept-data-loss`, { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        DATABASE_URL: SUPABASE_DATABASE_URL 
      }
    })
    console.log('✅ Schema pushed successfully!')

    // Step 3: Verify tables
    console.log('\n🔍 Step 3: Verifying tables...')
    execSync(`npx prisma db pull`, { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        DATABASE_URL: SUPABASE_DATABASE_URL 
      }
    })
    console.log('✅ Tables verified!')

    console.log(`
🎉 SUCCESS! Database schema pushed to Supabase!

📊 Tables created:
- users
- restaurants  
- menus
- menu_items
- tables
- orders
- order_items
- analytics
- otp_verifications

🔗 Check your Supabase dashboard:
https://supabase.com/dashboard/project/isletdfyulyiicpopcoq

📋 Next steps:
1. Verify tables in Supabase Table Editor
2. Run: npm run db:seed (to add sample data)
3. Test your application
    `)

  } catch (error) {
    console.error('\n❌ Error pushing schema:', error)
    console.log(`
🔧 Troubleshooting:
1. Check Supabase project status
2. Verify database credentials
3. Ensure network connectivity
4. Try running: npm run supabase:test
    `)
    process.exit(1)
  }
}

// Run the script
pushSchema()
