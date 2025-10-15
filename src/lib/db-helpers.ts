import { prisma } from './prisma-simple'
import { UserType, OrderStatus } from '@prisma/client'

// Database Helper Functions

export class DatabaseHelpers {
  // User Management
  static async createUser(email: string, type: UserType = UserType.CUSTOMER) {
    return await prisma.user.upsert({
      where: { email },
      update: { verified: true },
      create: {
        email,
        type,
        verified: true
      }
    })
  }

  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  static async verifyUser(email: string) {
    return await prisma.user.update({
      where: { email },
      data: { verified: true }
    })
  }

  // OTP Management
  static async createOTP(email: string, otp: string, expiresInMinutes: number = 10) {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)
    
    return await prisma.otpVerification.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        used: false
      },
      create: {
        email,
        otp,
        expiresAt
      }
    })
  }

  static async verifyOTP(email: string, otp: string) {
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (otpRecord) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { used: true }
      })
      return true
    }
    return false
  }

  // Restaurant Management
  static async createRestaurant(data: {
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    cuisine?: string
    description?: string
    operatingHours?: {
      open: string
      close: string
    }
  }) {
    return await prisma.restaurant.create({
      data: {
        ...data,
        operatingHours: data.operatingHours ? {
          create: data.operatingHours
        } : undefined
      },
      include: {
        operatingHours: true
      }
    })
  }

  static async findRestaurantByEmail(email: string) {
    return await prisma.restaurant.findUnique({
      where: { email },
      include: {
        operatingHours: true,
        menus: {
          include: {
            items: true
          }
        }
      }
    })
  }

  // Menu Management
  static async createMenu(restaurantId: string, name: string, description?: string) {
    return await prisma.menu.create({
      data: {
        restaurantId,
        name,
        description
      }
    })
  }

  static async addMenuItem(data: {
    menuId: string
    name: string
    description?: string
    price: number
    category: string
    image?: string
  }) {
    return await prisma.menuItem.create({
      data
    })
  }

  static async getMenuWithItems(restaurantId: string) {
    return await prisma.menu.findMany({
      where: {
        restaurantId,
        isActive: true
      },
      include: {
        items: {
          where: {
            isAvailable: true
          },
          include: {
            itemOptions: {
              include: {
                values: true
              }
            },
            customizations: true
          }
        }
      }
    })
  }

  // Table Management
  static async createTable(restaurantId: string, tableNumber: string) {
    return await prisma.table.create({
      data: {
        restaurantId,
        tableNumber
      }
    })
  }

  static async generateQRCode(restaurantId: string, tableId: string, qrCode: string, url: string) {
    return await prisma.qrCode.upsert({
      where: { tableId },
      update: {
        qrCode,
        url,
        isActive: true
      },
      create: {
        restaurantId,
        tableId,
        qrCode,
        url
      }
    })
  }

  static async getTablesWithQR(restaurantId: string) {
    return await prisma.table.findMany({
      where: {
        restaurantId,
        isActive: true
      },
      include: {
        qrCode: true
      }
    })
  }

  // Order Management
  static async createOrder(data: {
    restaurantId: string
    tableId?: string
    customerEmail: string
    items: Array<{
      itemId: string
      quantity: number
      price: number
      notes?: string
    }>
    subtotal: number
    tax?: number
    discount?: number
    estimatedTime?: string
    notes?: string
  }) {
    return await prisma.order.create({
      data: {
        ...data,
        items: {
          create: data.items
        }
      },
      include: {
        items: {
          include: {
            order: {
              include: {
                menu: true
              }
            }
          }
        },
        restaurant: true,
        table: true
      }
    })
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
  }

  static async getRestaurantOrders(restaurantId: string, status?: OrderStatus) {
    return await prisma.order.findMany({
      where: {
        restaurantId,
        ...(status && { status })
      },
      include: {
        items: {
          include: {
            order: true
          }
        },
        table: true,
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getCustomerOrders(customerEmail: string) {
    return await prisma.order.findMany({
      where: { customerEmail },
      include: {
        items: {
          include: {
            order: true
          }
        },
        restaurant: true,
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // Analytics
  static async updateAnalytics(restaurantId: string, date: Date, orderValue: number) {
    return await prisma.analytics.upsert({
      where: {
        restaurantId_date: {
          restaurantId,
          date
        }
      },
      update: {
        totalOrders: {
          increment: 1
        },
        totalRevenue: {
          increment: orderValue
        }
      },
      create: {
        restaurantId,
        date,
        totalOrders: 1,
        totalRevenue: orderValue,
        avgOrderValue: orderValue
      }
    })
  }

  static async getRestaurantAnalytics(restaurantId: string, startDate: Date, endDate: Date) {
    return await prisma.analytics.findMany({
      where: {
        restaurantId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  }

  // Cleanup Operations
  static async cleanupExpiredOTPs() {
    return await prisma.otpVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }

  static async cleanupOldOrders(daysOld: number = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
    
    return await prisma.order.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        status: OrderStatus.COMPLETED
      }
    })
  }

  // Health Check
  static async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Transaction helpers
export class TransactionHelpers {
  static async withTransaction<T>(callback: (tx: typeof prisma) => Promise<T>): Promise<T> {
    return await prisma.$transaction(callback)
  }

  static async createOrderWithItems(orderData: any, itemsData: any[]) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: orderData
      })

      const items = await Promise.all(
        itemsData.map(item => 
          tx.orderItem.create({
            data: {
              ...item,
              orderId: order.id
            }
          })
        )
      )

      return { order, items }
    })
  }
}

// Query optimization helpers
export class QueryHelpers {
  static async getRestaurantDashboard(restaurantId: string) {
    return await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        operatingHours: true,
        menus: {
          where: { isActive: true },
          include: {
            items: {
              where: { isAvailable: true },
              select: {
                id: true,
                name: true,
                price: true,
                category: true
              }
            }
          }
        },
        tables: {
          where: { isActive: true },
          include: {
            qrCode: true
          }
        },
        _count: {
          select: {
            orders: {
              where: {
                status: OrderStatus.PENDING
              }
            }
          }
        }
      }
    })
  }

  static async getOrderSummary(orderId: string) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            order: {
              select: {
                name: true,
                price: true
              }
            }
          }
        },
        restaurant: {
          select: {
            name: true,
            phone: true
          }
        },
        table: {
          select: {
            tableNumber: true
          }
        }
      }
    })
  }
}
