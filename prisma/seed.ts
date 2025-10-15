import { PrismaClient, UserType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      type: UserType.CUSTOMER,
      verified: true
    }
  })

  const restaurantOwner = await prisma.user.upsert({
    where: { email: 'restaurant@example.com' },
    update: {},
    create: {
      email: 'restaurant@example.com',
      type: UserType.RESTAURANT,
      verified: true
    }
  })

  console.log('✅ Created users')

  // Create sample restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { email: 'restaurant@example.com' },
    update: {},
    create: {
      name: 'The Garden Restaurant',
      email: 'restaurant@example.com',
      phone: '+1-555-0123',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      cuisine: 'American',
      description: 'Fresh, locally-sourced ingredients in a cozy atmosphere',
      operatingHours: {
        create: {
          open: '09:00',
          close: '22:00'
        }
      }
    },
    include: {
      operatingHours: true
    }
  })

  console.log('✅ Created restaurant')

  // Create sample menu
  const menu = await prisma.menu.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Main Menu',
      description: 'Our signature dishes and seasonal favorites'
    }
  })

  console.log('✅ Created menu')

  // Create sample menu items
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        menuId: menu.id,
        name: 'Garden Fresh Salad',
        description: 'Mixed greens, cherry tomatoes, cucumber, and house vinaigrette',
        price: 12.99,
        category: 'Appetizers',
        image: '/images/salad.jpg'
      }
    }),
    prisma.menuItem.create({
      data: {
        menuId: menu.id,
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with lemon herb butter, seasonal vegetables',
        price: 24.99,
        category: 'Main Courses',
        image: '/images/salmon.jpg'
      }
    }),
    prisma.menuItem.create({
      data: {
        menuId: menu.id,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with vanilla ice cream',
        price: 8.99,
        category: 'Desserts',
        image: '/images/cake.jpg'
      }
    }),
    prisma.menuItem.create({
      data: {
        menuId: menu.id,
        name: 'Craft Beer',
        description: 'Local brewery selection',
        price: 6.99,
        category: 'Beverages',
        image: '/images/beer.jpg'
      }
    })
  ])

  console.log('✅ Created menu items')

  // Create sample tables
  const tables = await Promise.all([
    prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: '1'
      }
    }),
    prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: '2'
      }
    }),
    prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: '3'
      }
    }),
    prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: '4'
      }
    }),
    prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: '5'
      }
    })
  ])

  console.log('✅ Created tables')

  // Create sample QR codes for tables
  const qrCodes = await Promise.all(
    tables.map(table =>
      prisma.qrCode.create({
        data: {
          restaurantId: restaurant.id,
          tableId: table.id,
          qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`, // Placeholder
          url: `https://menupro.app/order?restaurant=${restaurant.id}&table=${table.tableNumber}`
        }
      })
    )
  )

  console.log('✅ Created QR codes')

  // Create sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      restaurantId: restaurant.id,
      tableId: tables[0].id,
      customerEmail: customer.email,
      subtotal: 37.98,
      tax: 3.04,
      total: 41.02,
      estimatedTime: '15 minutes',
      items: {
        create: [
          {
            itemId: menuItems[0].id,
            quantity: 1,
            price: 12.99
          },
          {
            itemId: menuItems[1].id,
            quantity: 1,
            price: 24.99
          }
        ]
      }
    }
  })

  console.log('✅ Created sample order')

  // Create sample analytics
  await prisma.analytics.create({
    data: {
      restaurantId: restaurant.id,
      date: new Date(),
      totalOrders: 1,
      totalRevenue: 41.02,
      avgOrderValue: 41.02
    }
  })

  console.log('✅ Created analytics')

  console.log('🎉 Database seeded successfully!')
  console.log(`
📊 Summary:
- Users: 2 (1 customer, 1 restaurant)
- Restaurant: 1 (The Garden Restaurant)
- Menu: 1 (Main Menu)
- Menu Items: 4
- Tables: 5
- QR Codes: 5
- Orders: 1
- Analytics: 1 record
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
