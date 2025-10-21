import { Client } from 'pg'

const SUPABASE_DATABASE_URL = "postgresql://postgres:ETnpJs32ewdBtHhl@db.isletdfyulyiicpopcoq.supabase.co:5432/postgres?sslmode=require"

async function testConnection() {
  console.log('🔍 Testing Supabase database connection...')
  console.log(`📡 Database URL: ${SUPABASE_DATABASE_URL}`)
  
  const client = new Client({
    connectionString: SUPABASE_DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined
    }
  })

  try {
    await client.connect()
    console.log('✅ Successfully connected to Supabase database!')
    
    // Test a simple query
    const result = await client.query('SELECT version()')
    console.log('📊 Database version:', result.rows[0].version)
    
    // Check if we can create a test table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Test table created successfully')
    
    // Insert test data
    await client.query(`
      INSERT INTO test_connection (message) 
      VALUES ('Connection test successful')
    `)
    console.log('✅ Test data inserted successfully')
    
    // Clean up
    await client.query('DROP TABLE test_connection')
    console.log('✅ Test table cleaned up')
    
    console.log('\n🎉 Database connection test PASSED!')
    console.log('You can now proceed with pushing the Prisma schema.')
    
  } catch (error) {
    console.error('❌ Database connection test FAILED:', error)
    console.log('\n🔧 Possible issues:')
    console.log('1. Supabase project might be paused or inactive')
    console.log('2. Database credentials might be incorrect')
    console.log('3. Network connectivity issues')
    console.log('4. Supabase project might not exist')
    
    console.log('\n📞 Next steps:')
    console.log('1. Check Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Verify project status and credentials')
    console.log('3. Ensure project is not paused')
  } finally {
    await client.end()
  }
}

testConnection()
