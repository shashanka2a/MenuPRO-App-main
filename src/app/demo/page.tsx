import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, Clock, DollarSign, Smartphone, QrCode, Upload, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MenuOS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
            <Zap className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            See MenuOS in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch how Wendy&apos;s and other restaurants are revolutionizing their ordering experience with MenuOS. 
            No more waiting in lines, no more commission fees, just seamless digital ordering.
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardTitle className="text-2xl flex items-center">
                <Smartphone className="w-6 h-6 mr-3" />
                MenuOS Demo Video
              </CardTitle>
              <CardDescription className="text-orange-100">
                See how easy it is to place orders with our QR code system
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/sUAZhjzIiB4"
                  title="MenuOS Demo - QR Code Ordering System"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wendy's Case Study */}
        <div className="mb-16">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-4">
                How Wendy&apos;s Orders Became Easier with MenuOS
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Real results from restaurants using our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Before MenuOS</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Long wait times during peak hours</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Staff overwhelmed with taking orders</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">High commission fees from third-party apps</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Limited menu visibility and customization</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">After MenuOS</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">50% faster order processing</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Staff can focus on food preparation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Zero commission fees - keep 100% of revenue</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Full control over menu and pricing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Restaurants Choose MenuOS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Setup in 15 Minutes</h3>
              <p className="text-gray-600">
                Upload your menu, generate QR codes, and start accepting orders immediately. 
                No complex setup or technical knowledge required.
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No Commission Fees</h3>
              <p className="text-gray-600">
                Unlike DoorDash (30% fees) or Uber Eats (25% fees), MenuOS charges only 
                $19/month flat rate. Keep 100% of your revenue.
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">QR Code Ordering</h3>
              <p className="text-gray-600">
                Customers scan QR codes at their table, browse your menu, and place orders 
                directly. No app downloads required.
              </p>
            </Card>
          </div>
        </div>

        {/* Integration Steps Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How Easy Is MenuOS Integration?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Get your restaurant up and running with MenuOS in just 4 simple steps. 
            No technical expertise required!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="relative p-6 text-center hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                <Upload className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Menu</h3>
              <p className="text-gray-600 text-sm">
                Simply upload your menu PDF or take photos. Our AI automatically extracts 
                items, prices, and descriptions. Takes 2 minutes.
              </p>
              <div className="mt-4 p-2 bg-green-50 rounded-lg">
                <p className="text-green-700 text-xs font-medium">
                  ✓ AI-powered menu parsing
                </p>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="relative p-6 text-center hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate QR Codes</h3>
              <p className="text-gray-600 text-sm">
                Our system automatically generates unique QR codes for each table. 
                Print and place them on tables. Takes 1 minute.
              </p>
              <div className="mt-4 p-2 bg-green-50 rounded-lg">
                <p className="text-green-700 text-xs font-medium">
                  ✓ Instant QR generation
                </p>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="relative p-6 text-center hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Taking Orders</h3>
              <p className="text-gray-600 text-sm">
                Customers scan QR codes and place orders directly. Orders appear 
                instantly on your dashboard. Ready in 30 seconds.
              </p>
              <div className="mt-4 p-2 bg-green-50 rounded-lg">
                <p className="text-green-700 text-xs font-medium">
                  ✓ Real-time order management
                </p>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="relative p-6 text-center hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scale & Optimize</h3>
              <p className="text-gray-600 text-sm">
                Track sales, update menus instantly, and optimize operations with 
                detailed analytics. Continuous improvement.
              </p>
              <div className="mt-4 p-2 bg-green-50 rounded-lg">
                <p className="text-green-700 text-xs font-medium">
                  ✓ Advanced analytics included
                </p>
              </div>
            </Card>
          </div>

          {/* Efficiency Assertions */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-900">
                  MenuOS Makes Your Restaurant More Efficient
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  Proven results from restaurants using our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">50%</div>
                    <p className="text-gray-700 font-medium">Faster Order Processing</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Customers place orders 3x faster than traditional methods
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
                    <p className="text-gray-700 font-medium">Reduced Wait Times</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Average table turnover increased by 75%
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
                    <p className="text-gray-700 font-medium">Staff Efficiency Gain</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Staff can focus on food prep instead of taking orders
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
                    <p className="text-gray-700 font-medium">Revenue Retention</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Keep all revenue - no commission fees like DoorDash
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-red-600 mb-2">15min</div>
                    <p className="text-gray-700 font-medium">Setup Time</p>
                    <p className="text-sm text-gray-600 mt-1">
                      From signup to first order in under 15 minutes
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                    <p className="text-gray-700 font-medium">Order Management</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Update menus, track sales, manage orders anytime
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                    Real Restaurant Testimonials
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-700 italic">
                        &ldquo;MenuOS saved us 2 hours daily on order taking. Our staff can now focus 
                        on what matters - making great food.&rdquo;
                      </p>
                      <p className="text-sm text-gray-600 font-medium">- Sarah Chen, Owner, Golden Dragon</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 italic">
                        &ldquo;We increased our table turnover by 75% and eliminated order errors. 
                        Best $19 we spend monthly.&rdquo;
                      </p>
                      <p className="text-sm text-gray-600 font-medium">- Mike Rodriguez, Manager, Tony&apos;s Pizza</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="text-xl mb-8 text-orange-100">
                Join thousands of restaurants already using MenuOS to streamline their operations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-orange-50"
                  asChild
                >
                  <Link href="/">Start Free Trial</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-orange-600"
                  asChild
                >
                  <Link href="/">Schedule Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
