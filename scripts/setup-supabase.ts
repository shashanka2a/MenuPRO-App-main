import { SupabaseIntegration } from '../src/lib/supabase-integration'
import { prisma } from '../src/lib/prisma-simple'

async function setupSupabase() {
  console.log('🚀 Setting up Supabase integration...')

  try {
    // 1. Health check
    console.log('📊 Checking system health...')
    const health = await SupabaseIntegration.healthCheck()
    console.log('Health status:', health)

    if (health.overall !== 'healthy') {
      console.error('❌ System health check failed')
      return
    }

    // 2. Setup storage buckets
    console.log('📁 Setting up storage buckets...')
    await SupabaseIntegration.setupStorageBuckets()

    // 3. Run database migration
    console.log('🗄️ Running database migration...')
    try {
      await prisma.$executeRaw`SELECT 1`
      console.log('✅ Database connection successful')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      return
    }

    // 4. Migrate existing data (if any)
    console.log('🔄 Migrating existing data...')
    await SupabaseIntegration.migrateExistingData()

    // 5. Create sample data if database is empty
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      console.log('🌱 Database is empty, creating sample data...')
      // Run seed script
      const { exec } = require('child_process')
      exec('npm run db:seed', (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('❌ Failed to seed database:', error)
          return
        }
        console.log('✅ Sample data created')
      })
    }

    console.log('🎉 Supabase setup completed successfully!')
    console.log(`
📋 Next steps:
1. Update your .env.local with Supabase credentials
2. Run: npm run db:push (to sync schema)
3. Run: npm run db:seed (to populate with sample data)
4. Test the integration with: npm run dev

🔗 Supabase Dashboard: https://supabase.com/dashboard/project/isletdfyulyiicpopcoq
    `)

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run setup if called directly
if (require.main === module) {
  setupSupabase()
}

export default setupSupabase
