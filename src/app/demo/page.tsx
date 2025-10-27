import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, Clock, DollarSign, Smartphone, QrCode, Upload, TrendingUp, ArrowRight, Star, Users, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">MenuOS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
                  Back to Home
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            See MenuOS in{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Action
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Watch how Wendy&apos;s and other restaurants are revolutionizing their ordering experience with MenuOS. 
            <span className="text-orange-600 font-semibold">No more waiting in lines</span>, 
            <span className="text-red-600 font-semibold">no more commission fees</span>, 
            just seamless digital ordering.
          </p>
        </div>

        {/* Enhanced Video Section */}
        <div className="mb-24">
          <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-orange-50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <CardTitle className="text-3xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 mr-4" />
                  MenuOS Demo Video
                </CardTitle>
                <CardDescription className="text-orange-100 text-lg mt-2 text-center">
                  See how easy it is to place orders with our QR code system
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-300 group-hover:scale-105"
                  src="https://www.youtube.com/embed/sUAZhjzIiB4"
                  title="MenuOS Demo - QR Code Ordering System"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Wendy's Case Study */}
        <div className="mb-24">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
            <CardHeader className="text-center pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
                How Wendy&apos;s Orders Became Easier with MenuOS
              </CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Real results from restaurants using our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Before MenuOS</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-red-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg">Long wait times during peak hours</span>
                    </li>
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-red-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg">Staff overwhelmed with taking orders</span>
                    </li>
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-red-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg">High commission fees from third-party apps</span>
                    </li>
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-red-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg">Limited menu visibility and customization</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">After MenuOS</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-green-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg font-semibold">50% faster order processing</span>
                    </li>
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-green-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg font-semibold">Staff can focus on food preparation</span>
                    </li>
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-green-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg font-semibold">Zero commission fees - keep 100% of revenue</span>
                    </li>
                    <li className="flex items-start group">
                      <div className="w-6 h-6 bg-green-500 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                      <span className="text-gray-700 text-lg font-semibold">Full control over menu and pricing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Benefits Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Restaurants Choose MenuOS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of restaurants that have transformed their operations with MenuOS
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-orange-50 group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Setup in 15 Minutes</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Upload your menu, generate QR codes, and start accepting orders immediately. 
                No complex setup or technical knowledge required.
              </p>
              <div className="mt-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Lightning-fast setup
                </p>
              </div>
            </Card>
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-green-50 group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">No Commission Fees</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Unlike DoorDash (30% fees) or Uber Eats (25% fees), MenuOS charges only 
                $19/month flat rate. Keep 100% of your revenue.
              </p>
              <div className="mt-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Keep all profits
                </p>
              </div>
            </Card>
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">QR Code Ordering</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Customers scan QR codes at their table, browse your menu, and place orders 
                directly. No app downloads required.
              </p>
              <div className="mt-6 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <Smartphone className="w-5 h-5 mr-2" />
                  No app required
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Integration Steps Flow */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How Easy Is MenuOS Integration?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your restaurant up and running with MenuOS in just 4 simple steps. 
              <span className="text-orange-600 font-semibold">No technical expertise required!</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card className="relative p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-orange-50 group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Upload Your Menu</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Simply upload your menu PDF or take photos. Our AI automatically extracts 
                items, prices, and descriptions. Takes 2 minutes.
              </p>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  AI-powered menu parsing
                </p>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="relative p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50 group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-6 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Generate QR Codes</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our system automatically generates unique QR codes for each table. 
                Print and place them on tables. Takes 1 minute.
              </p>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Instant QR generation
                </p>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="relative p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-6 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Start Taking Orders</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Customers scan QR codes and place orders directly. Orders appear 
                instantly on your dashboard. Ready in 30 seconds.
              </p>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Real-time order management
                </p>
              </div>
            </Card>

            {/* Step 4 */}
            <Card className="relative p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-green-50 group">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Scale & Optimize</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Track sales, update menus instantly, and optimize operations with 
                detailed analytics. Continuous improvement.
              </p>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Advanced analytics included
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Efficiency Assertions */}
        <div className="mb-24">
          <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-0 shadow-2xl overflow-hidden">
            <CardHeader className="text-center pb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mb-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
                MenuOS Makes Your Restaurant More Efficient
              </CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Proven results from restaurants using our platform
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div className="text-center p-6 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl font-bold text-green-600 mb-3">50%</div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Faster Order Processing</p>
                  <p className="text-gray-600">
                    Customers place orders 3x faster than traditional methods
                  </p>
                </div>
                <div className="text-center p-6 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl font-bold text-blue-600 mb-3">75%</div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Reduced Wait Times</p>
                  <p className="text-gray-600">
                    Average table turnover increased by 75%
                  </p>
                </div>
                <div className="text-center p-6 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl font-bold text-purple-600 mb-3">90%</div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Staff Efficiency Gain</p>
                  <p className="text-gray-600">
                    Staff can focus on food prep instead of taking orders
                  </p>
                </div>
                <div className="text-center p-6 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl font-bold text-orange-600 mb-3">100%</div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Revenue Retention</p>
                  <p className="text-gray-600">
                    Keep all revenue - no commission fees like DoorDash
                  </p>
                </div>
                <div className="text-center p-6 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl font-bold text-red-600 mb-3">15min</div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Setup Time</p>
                  <p className="text-gray-600">
                    From signup to first order in under 15 minutes
                  </p>
                </div>
                <div className="text-center p-6 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl font-bold text-indigo-600 mb-3">24/7</div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Order Management</p>
                  <p className="text-gray-600">
                    Update menus, track sales, manage orders anytime
                  </p>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-500 mr-3" />
                  Real Restaurant Testimonials
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">S</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Sarah Chen</p>
                        <p className="text-gray-600">Owner, Golden Dragon</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg italic leading-relaxed">
                      &ldquo;MenuOS saved us 2 hours daily on order taking. Our staff can now focus 
                      on what matters - making great food.&rdquo;
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">M</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Mike Rodriguez</p>
                        <p className="text-gray-600">Manager, Tony&apos;s Pizza</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-lg italic leading-relaxed">
                      &ldquo;We increased our table turnover by 75% and eliminated order errors. 
                      Best $19 we spend monthly.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-2xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-16 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="text-xl md:text-2xl mb-12 text-orange-100 max-w-3xl mx-auto leading-relaxed">
                Join thousands of restaurants already using MenuOS to streamline their operations
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 h-auto font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/" className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-6 h-auto font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/" className="flex items-center">
                    Schedule Demo
                    <Users className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
