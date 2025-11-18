import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, X, ArrowLeft, Settings, Shield, QrCode, UserPlus, FileText, ShoppingCart, BarChart3, ArrowRight, Clock, TrendingUp, Target, Quote, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation Bar - Enhanced */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/menupro-logo.svg"
                alt="MenuOS Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold font-sans text-[#1a1a2e] transition-transform duration-300 hover:scale-105">
                MenuOS
              </span>
            </Link>
            
            {/* Links - Center - Enhanced with Underline Hover */}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <a href="#services" className="text-[#1a1a2e] hover:text-[#FF6B00] transition-all duration-300 font-sans font-semibold text-base relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B00] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="text-[#1a1a2e] hover:text-[#FF6B00] transition-all duration-300 font-sans font-semibold text-base relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B00] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#testimonials" className="text-[#1a1a2e] hover:text-[#FF6B00] transition-all duration-300 font-sans font-semibold text-base relative group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B00] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
            
            {/* CTAs - Right - Enhanced Hierarchy */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-[#1a1a2e] hover:text-[#FF6B00] transition-colors font-sans text-sm hidden md:block"
              >
                Login
              </a>
              <Button 
                className="bg-[#FF6B00] hover:bg-[#e55a00] text-white font-sans font-bold px-6 py-2.5 text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
                asChild
              >
                <Link href="/">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Enhanced */}
        <section className="pt-20 pb-16">
          {/* Back to Home - Reduced Size and Opacity */}
          <div className="mb-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#1a1a2e]/60 hover:text-[#FF6B00] transition-all duration-300 text-sm font-medium group"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a1a2e] mb-4 animate-slide-up">
              See MenuOS in Action
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how restaurants streamline operations, reduce errors, and boost efficiency with our all-in-one platform
            </p>
          </div>
          
          {/* Video Player - Framed in Card */}
          <div className="mb-10">
            <Card className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '56.25%', maxWidth: '900px', margin: '0 auto' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/sUAZhjzIiB4?rel=0&modestbranding=1&showinfo=0&enablejsapi=1"
                    title="MenuOS Demo - QR Code Ordering System"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button - Enhanced */}
          <div className="text-center py-6">
            <Button 
              className="bg-gradient-to-r from-[#FF6B00] to-[#e55a00] hover:from-[#e55a00] hover:to-[#d45000] text-white text-lg font-bold px-10 py-7 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="https://calendly.com/5ha5hank/availability" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Schedule Your Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trusted By Logo Bar */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-6 font-medium">Trusted By</p>
            <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
              <div className="text-2xl font-bold text-gray-400">Wendy&apos;s</div>
              <div className="text-2xl font-bold text-gray-400">Bella Vista</div>
              <div className="text-2xl font-bold text-gray-400">Golden Dragon</div>
              <div className="text-2xl font-bold text-gray-400">Tony&apos;s Pizza</div>
            </div>
          </div>
        </section>

        {/* Before & After Comparison - Enhanced */}
        <section className="py-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-3">
              Stop Guessing, Start Automating
            </h2>
            <p className="text-lg text-gray-600">
              See the transformation in restaurant operations
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before Card */}
            <Card className="bg-gray-50 border-2 border-gray-200 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">Manual Errors</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-base">Order mistakes</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-base">Slow turnover</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-base">Staff overwhelmed</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-base">High commission fees</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* After Card */}
            <Card className="bg-white border-t-4 border-[#FF6B00] border-2 border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-10">
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">MenuOS Automation</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#FF6B00] mr-3 mt-0.5 flex-shrink-0" fill="#FF6B00" />
                    <span className="text-[#1a1a2e] font-semibold text-base">Automated orders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#FF6B00] mr-3 mt-0.5 flex-shrink-0" fill="#FF6B00" />
                    <span className="text-[#1a1a2e] font-semibold text-base">Faster service</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#FF6B00] mr-3 mt-0.5 flex-shrink-0" fill="#FF6B00" />
                    <span className="text-[#1a1a2e] font-semibold text-base">Staff efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#FF6B00] mr-3 mt-0.5 flex-shrink-0" fill="#FF6B00" />
                    <span className="text-[#1a1a2e] font-semibold text-base">Zero commission fees</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Features - Enhanced with Better Hover */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              Why Restaurants Choose MenuOS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to modernize your restaurant operations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-2 border-gray-200 shadow-md rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#FF6B00]">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                  <Settings className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">Easy Installation</h3>
                <p className="text-[#1a1a2e] leading-relaxed">
                  Setup in 15 minutes. Upload your menu, generate QR codes, and start accepting orders immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200 shadow-md rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#FF6B00]">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                  <Shield className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">No Commission Fees</h3>
                <p className="text-[#1a1a2e] leading-relaxed">
                  Unlike DoorDash or Uber Eats, MenuOS charges only $19/month flat rate. Keep 100% of your revenue.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200 shadow-md rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-[#FF6B00]">
              <CardContent className="p-10 text-center">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
                  <QrCode className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">QR Code Ordering</h3>
                <p className="text-[#1a1a2e] leading-relaxed">
                  Customers scan QR codes at their table and place orders directly. No app downloads required.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Integration Steps - Enhanced with S-Curve */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              How Easy Is MenuOS Integration?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in four simple steps
            </p>
          </div>
          
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* S-Curve connector for desktop */}
              <div className="hidden md:block absolute top-8 left-0 right-0 h-1 z-0">
                <svg className="w-full h-full" viewBox="0 0 1000 10" preserveAspectRatio="none">
                  <path 
                    d="M 0 5 Q 250 2, 500 5 T 1000 5" 
                    stroke="#e5e7eb" 
                    strokeWidth="2" 
                    fill="none"
                    className="opacity-60"
                  />
                </svg>
              </div>
              
              {/* Step 1 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-110 shadow-lg">
                  <UserPlus className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Sign Up</h3>
                <p className="text-[#1a1a2e]">
                  Create your account in minutes
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-110 shadow-lg">
                  <FileText className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Configure Menu</h3>
                <p className="text-[#1a1a2e]">
                  Upload your menu and generate QR codes
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-110 shadow-lg">
                  <ShoppingCart className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Start Taking Orders</h3>
                <p className="text-[#1a1a2e]">
                  Customers scan and order instantly
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-5 transition-transform duration-300 hover:scale-110 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Scale & Optimize</h3>
                <p className="text-[#1a1a2e]">
                  Monitor sales and optimize operations
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              MenuOS Makes Your Restaurant More Efficient
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proven results from restaurants using our platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 shadow-md p-8 text-center transition-all duration-300 hover:shadow-lg">
              <Clock className="w-12 h-12 text-[#FF6B00] mx-auto mb-4" />
              <div className="text-6xl font-bold text-[#FF6B00] mb-3">50%</div>
              <p className="text-xl font-semibold text-[#1a1a2e] mb-2">Faster Order Processing</p>
              <p className="text-gray-600 text-sm">Customers place orders 3x faster than traditional methods</p>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-md p-8 text-center transition-all duration-300 hover:shadow-lg">
              <TrendingUp className="w-12 h-12 text-[#FF6B00] mx-auto mb-4" />
              <div className="text-6xl font-bold text-[#FF6B00] mb-3">75%</div>
              <p className="text-xl font-semibold text-[#1a1a2e] mb-2">Reduced Wait Times</p>
              <p className="text-gray-600 text-sm">Average table turnover increased by 75%</p>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-md p-8 text-center transition-all duration-300 hover:shadow-lg">
              <Target className="w-12 h-12 text-[#FF6B00] mx-auto mb-4" />
              <div className="text-6xl font-bold text-[#FF6B00] mb-3">100%</div>
              <p className="text-xl font-semibold text-[#1a1a2e] mb-2">Order Accuracy</p>
              <p className="text-gray-600 text-sm">Eliminate order mistakes with automated processing</p>
            </Card>
          </div>
        </section>

        {/* Schedule Demo Section - Enhanced with Testimonial */}
        <section className="py-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-3">
              Schedule Your Personal Demo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book a 15-minute demo with our team to see MenuOS in action
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial Column */}
            <div className="md:col-span-1">
              <Card className="bg-white border-2 border-gray-200 shadow-md h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <Quote className="w-8 h-8 text-[#FF6B00] mb-4" />
                  <p className="text-lg text-[#1a1a2e] mb-6 italic leading-relaxed flex-grow">
                    &ldquo;MenuOS completely transformed our restaurant operations. We&apos;ve seen a 50% increase in order accuracy and our customers love the convenience.&rdquo;
                  </p>
                  <div>
                    <p className="font-bold text-[#1a1a2e]">John Doe</p>
                    <p className="text-sm text-gray-600">Owner, Bella Vista Bistro</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Calendar Column */}
            <div className="md:col-span-2">
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="relative w-full" style={{ paddingBottom: '75%', minHeight: '500px' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://calendly.com/5ha5hank/availability?embed=true&embed_domain=menupro.app&embed_type=Inline"
                      title="Schedule Demo with MenuOS Team"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Enhanced */}
        <section className="py-16">
          <Card className="bg-gradient-to-br from-[#1a1a2e] via-[#1f1f3a] to-[#1a1a2e] border-0 shadow-2xl">
            <CardContent className="p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of restaurants already using MenuOS to streamline their operations
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button 
                  className="bg-[#FF6B00] hover:bg-[#e55a00] text-white text-lg px-12 py-7 font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  asChild
                >
                  <Link href="https://calendly.com/5ha5hank/availability" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Free Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Link 
                  href="/" 
                  className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                >
                  Explore All Features
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer - Enhanced with Navy Background */}
      <footer className="bg-[#0B224A] text-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Column 1 - Branding */}
            <div>
              <div className="flex items-center space-x-3 mb-5">
                <Image
                  src="/menupro-logo.svg"
                  alt="MenuOS Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold text-white">
                  MenuOS
                </span>
              </div>
              <p className="text-white/70 text-sm">
                The best restaurant CMS for digital menus and QR ordering.
              </p>
            </div>

            {/* Column 2 - Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2.5">
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Features</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Pricing</Link></li>
                <li><Link href="/demo" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Demo</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Integrations</Link></li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2.5">
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">About</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Blog</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Careers</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-[#FF6B00] transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>

            {/* Column 4 - Social */}
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/menuos.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/menuos.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/menuos-app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/70 text-sm">
              © 2024 MenuOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
