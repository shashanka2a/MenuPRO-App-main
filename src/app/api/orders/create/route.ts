import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: {
    size?: string;
    customizations?: string[];
  };
}

interface Order {
  id: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
  createdAt: string;
  estimatedTime: string;
}

// In-memory storage (in production, use a database)
const orders: Order[] = [];

function generateOrderNumber(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function calculateEstimatedTime(itemCount: number): string {
  // Simple estimation: 5 minutes base + 2 minutes per item
  const totalMinutes = 5 + (itemCount * 2);
  return `${totalMinutes} minutes`;
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Order items are required' },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce((sum: number, item: OrderItem) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order
    const order: Order = {
      id: generateOrderNumber(),
      email: decoded.email,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedTime: calculateEstimatedTime(items.length)
    };

    // Store order
    orders.push(order);

    // In a real app, you would:
    // 1. Save to database
    // 2. Send notification to restaurant staff
    // 3. Update kitchen display system
    // 4. Send confirmation email to customer

    console.log('New order created:', order);

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: {
          id: order.id,
          total: order.total,
          estimatedTime: order.estimatedTime,
          status: order.status
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Get orders for a specific user
export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user's orders
    const userOrders = orders.filter(order => order.email === decoded.email);

    return NextResponse.json(
      { orders: userOrders },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { message: 'Failed to get orders' },
      { status: 500 }
    );
  }
}
