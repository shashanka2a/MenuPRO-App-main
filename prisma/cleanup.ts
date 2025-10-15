import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Starting database cleanup...')

  // Clean up expired OTPs
  const expiredOTPs = await prisma.otpVerification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
  console.log(`✅ Cleaned up ${expiredOTPs.count} expired OTPs`)

  // Clean up old completed orders (older than 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const oldOrders = await prisma.order.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo
      },
      status: 'COMPLETED'
    }
  })
  console.log(`✅ Cleaned up ${oldOrders.count} old completed orders`)

  // Clean up unused QR codes (for inactive tables)
  const unusedQRCodes = await prisma.qrCode.deleteMany({
    where: {
      table: {
        isActive: false
      }
    }
  })
  console.log(`✅ Cleaned up ${unusedQRCodes.count} unused QR codes`)

  // Clean up inactive menu items
  const inactiveMenuItems = await prisma.menuItem.updateMany({
    where: {
      isAvailable: false,
      updatedAt: {
        lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    },
    data: {
      // This would be a soft delete in production
      // For cleanup, we might want to actually delete them
    }
  })
  console.log(`✅ Processed ${inactiveMenuItems.count} inactive menu items`)

  // Update analytics for yesterday (if not exists)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true }
  })

  for (const restaurant of restaurants) {
    const yesterdayOrders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        createdAt: {
          gte: yesterday,
          lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (yesterdayOrders.length > 0) {
      const totalRevenue = yesterdayOrders.reduce((sum, order) => sum + Number(order.total), 0)
      const avgOrderValue = totalRevenue / yesterdayOrders.length

      await prisma.analytics.upsert({
        where: {
          restaurantId_date: {
            restaurantId: restaurant.id,
            date: yesterday
          }
        },
        update: {
          totalOrders: yesterdayOrders.length,
          totalRevenue,
          avgOrderValue
        },
        create: {
          restaurantId: restaurant.id,
          date: yesterday,
          totalOrders: yesterdayOrders.length,
          totalRevenue,
          avgOrderValue
        }
      })
    }
  }

  console.log('✅ Updated analytics for yesterday')

  // Database health check
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database health check passed')
  } catch (error) {
    console.error('❌ Database health check failed:', error)
  }

  console.log('🎉 Database cleanup completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
