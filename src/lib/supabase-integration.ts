import { useState, useEffect } from 'react'
import { supabase, supabaseAdmin, SupabaseHelpers } from './supabase'
import { prisma } from './prisma-simple'
import { DatabaseHelpers } from './db-helpers'

// Hybrid approach: Use Prisma for complex queries and Supabase for real-time features
export class SupabaseIntegration {
  
  // Authentication with Supabase Auth
  static async authenticateUser(email: string, password?: string) {
    if (password) {
      // Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { user: data.user, error }
    } else {
      // Check if user exists in our database
      const user = await DatabaseHelpers.findUserByEmail(email)
      if (user) {
        // Create Supabase session for existing user
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false
          }
        })
        return { user: data.user, error }
      }
      return { user: null, error: new Error('User not found') }
    }
  }

  // Real-time order updates
  static async subscribeToRestaurantOrders(restaurantId: string, onUpdate: (order: any) => void) {
    return SupabaseHelpers.subscribeToOrders(restaurantId, (payload) => {
      console.log('Order update received:', payload)
      onUpdate(payload.new)
    })
  }

  // Real-time order status updates for customers
  static async subscribeToOrderStatus(orderId: string, onStatusUpdate: (status: string) => void) {
    return SupabaseHelpers.subscribeToOrderStatus(orderId, (payload) => {
      console.log('Order status update:', payload)
      onStatusUpdate(payload.new.status)
    })
  }

  // File uploads with Supabase Storage
  static async uploadMenuImage(file: File, restaurantId: string, menuItemId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${restaurantId}/${menuItemId}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)

    return {
      path: data.path,
      url: urlData.publicUrl
    }
  }

  // Hybrid data operations
  static async createOrderWithRealtime(orderData: any, itemsData: any[]) {
    // Create order using Prisma (better for complex transactions)
    const order = await DatabaseHelpers.createOrder({
      ...orderData,
      items: itemsData
    })

    // Update analytics using Supabase (better for real-time updates)
    await this.updateAnalyticsRealtime(orderData.restaurantId, Number(order.total))

    // Notify restaurant via real-time subscription
    await this.notifyRestaurantNewOrder(orderData.restaurantId, order)

    return order
  }

  static async updateOrderStatusWithRealtime(orderId: string, status: string) {
    // Update in database using Prisma
    const order = await DatabaseHelpers.updateOrderStatus(orderId, status as any)

    // Real-time notification will be handled by Supabase subscription
    return order
  }

  // Analytics with real-time updates
  static async updateAnalyticsRealtime(restaurantId: string, orderValue: number) {
    const today = new Date().toISOString().split('T')[0]
    
    // Update analytics in database
    await DatabaseHelpers.updateAnalytics(restaurantId, new Date(today), orderValue)

    // Could trigger real-time dashboard updates here
    console.log(`Analytics updated for restaurant ${restaurantId}: +$${orderValue}`)
  }

  // Notification helpers
  static async notifyRestaurantNewOrder(restaurantId: string, order: any) {
    // This would integrate with Supabase Edge Functions for push notifications
    console.log(`New order notification for restaurant ${restaurantId}:`, order.orderNumber)
    
    // Could also send email notifications here
    // await sendEmailNotification(restaurantId, order)
  }

  // Data synchronization helpers
  static async syncUserToSupabase(userData: any) {
    // Ensure user exists in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      email_confirm: true,
      user_metadata: {
        type: userData.type
      }
    })

    if (error && !error.message.includes('already registered')) {
      throw error
    }

    return data
  }

  // Health check for both Prisma and Supabase
  static async healthCheck() {
    const prismaHealth = await DatabaseHelpers.healthCheck()
    
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      const supabaseHealth = error ? { status: 'unhealthy', error: error.message } : { status: 'healthy' }
      
      return {
        prisma: prismaHealth,
        supabase: supabaseHealth,
        overall: prismaHealth.status === 'healthy' && supabaseHealth.status === 'healthy' ? 'healthy' : 'unhealthy'
      }
    } catch (error) {
      return {
        prisma: prismaHealth,
        supabase: { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' },
        overall: 'unhealthy'
      }
    }
  }

  // Migration helpers
  static async migrateExistingData() {
    console.log('Starting data migration to Supabase...')
    
    // Get all users from Prisma
    const users = await prisma.user.findMany()
    
    for (const user of users) {
      try {
        // Create user in Supabase Auth
        await this.syncUserToSupabase(user)
        console.log(`Migrated user: ${user.email}`)
      } catch (error) {
        console.error(`Failed to migrate user ${user.email}:`, error)
      }
    }

    console.log('Data migration completed')
  }

  // Storage bucket setup
  static async setupStorageBuckets() {
    const buckets = [
      { name: 'menu-images', public: true },
      { name: 'restaurant-logos', public: true },
      { name: 'qr-codes', public: true }
    ]

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabaseAdmin.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        })

        if (error && !error.message.includes('already exists')) {
          console.error(`Failed to create bucket ${bucket.name}:`, error)
        } else {
          console.log(`Bucket ${bucket.name} ready`)
        }
      } catch (error) {
        console.error(`Error setting up bucket ${bucket.name}:`, error)
      }
    }
  }
}

// Real-time hooks for React components
export const useRealtimeOrders = (restaurantId: string) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    const loadOrders = async () => {
      try {
        const { data } = await SupabaseHelpers.getRestaurantOrders(restaurantId)
        setOrders(data || [])
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()

    // Subscribe to real-time updates
    let subscription: any = null
    
    SupabaseIntegration.subscribeToRestaurantOrders(
      restaurantId,
      (newOrder) => {
        setOrders(prev => [newOrder, ...prev])
      }
    ).then(sub => {
      subscription = sub
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [restaurantId])

  return { orders, loading }
}

export const useRealtimeOrderStatus = (orderId: string) => {
  const [status, setStatus] = useState('PENDING')

  useEffect(() => {
    let subscription: any = null
    
    SupabaseIntegration.subscribeToOrderStatus(
      orderId,
      (newStatus) => {
        setStatus(newStatus)
      }
    ).then(sub => {
      subscription = sub
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [orderId])

  return status
}

export default SupabaseIntegration
