'use client'

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit3, 
  Plus,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import Image from "next/image";

interface RestaurantDashboardProps {
  restaurantData: any;
  onLogout: () => void;
}

interface Order {
  id: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served';
  createdAt: string;
  estimatedTime: string;
  tableNumber?: string;
}

export function RestaurantDashboard({ restaurantData, onLogout }: RestaurantDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    avgOrderValue: 0
  });

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD001',
        customerEmail: 'john@example.com',
        items: [
          { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
          { name: 'Caesar Salad', quantity: 1, price: 12.99 }
        ],
        total: 31.98,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedTime: '15-20 minutes',
        tableNumber: '5'
      },
      {
        id: 'ORD002',
        customerEmail: 'sarah@example.com',
        items: [
          { name: 'Chicken Pasta', quantity: 1, price: 16.99 },
          { name: 'Garlic Bread', quantity: 1, price: 6.99 }
        ],
        total: 23.98,
        status: 'preparing',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        estimatedTime: '10-15 minutes',
        tableNumber: '3'
      }
    ];
    setOrders(mockOrders);
    
    setStats({
      totalOrders: 45,
      pendingOrders: 2,
      todayRevenue: 1247.50,
      avgOrderValue: 27.72
    });
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <RefreshCw className="w-4 h-4" />;
      case 'ready': return <Bell className="w-4 h-4" />;
      case 'served': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/menupro-logo.png"
                alt="MenuPRO Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MenuPRO Dashboard</h1>
                <p className="text-sm text-gray-600">{restaurantData?.name || 'Restaurant Name'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today&apos;s Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.todayRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.avgOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Manual Order
              </Button>
            </div>

            <div className="grid gap-6">
              {orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.customerEmail} • Table {order.tableNumber} • {formatTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.estimatedTime}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Confirm
                          </Button>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Start Preparing
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'served')}
                          size="sm"
                          className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                          Mark Served
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Menu management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Restaurant Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Restaurant settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
