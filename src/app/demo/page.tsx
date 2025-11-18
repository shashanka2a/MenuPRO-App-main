import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, X, Clock, DollarSign, Smartphone, QrCode, Upload, TrendingUp, ArrowRight, Users, Shield, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
              <span className="text-2xl font-bold">
                <span className="text-[#1a1a2e]">Menu</span>
                <span className="text-[#E67A50]">OS</span>
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-[#1a1a2e] hover:text-[#E67A50] transition-colors font-medium">
                Home
              </Link>
              <Link href="/" className="text-[#1a1a2e] hover:text-[#E67A50] transition-colors font-medium">
                Features
              </Link>
              <Link href="/" className="text-[#1a1a2e] hover:text-[#E67A50] transition-colors font-medium">
                Pricing
              </Link>
              <Button className="bg-[#E67A50] hover:bg-[#d4693f] text-white font-semibold px-6" asChild>
                <Link href="/">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section - See in Action */}
        <div className="mb-24">
          <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a2e] mb-12 text-center">
            See MenuOS in Action
          </h1>
          
          {/* Video Player */}
          <div className="mb-8">
            <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/sUAZhjzIiB4?rel=0&modestbranding=1&showinfo=0&enablejsapi=1"
                title="MenuOS Demo - QR Code Ordering System"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Full-width CTA Button */}
          <div className="px-4">
            <Button 
              className="w-full bg-[#E67A50] hover:bg-[#d4693f] text-white text-lg font-semibold py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              asChild
            >
              <Link href="https://calendly.com/5ha5hank/availability" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Schedule Your Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* How Wendy's Orders Section - Before & After */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before Card - Manual Errors */}
            <Card className="bg-[#f9f9f9] border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">Manual Errors</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-lg">Order mistakes</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-lg">Slow turnover</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-lg">Staff overwhelmed</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-[#1a1a2e] mr-3 mt-1 flex-shrink-0" />
                    <span className="text-[#1a1a2e] text-lg">High commission fees</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* After Card - MenuOS Automation */}
            <Card className="bg-white border-t-4 border-[#E67A50] border-0 shadow-md">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">MenuOS Automation</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#E67A50] mr-3 mt-1 flex-shrink-0" fill="#E67A50" />
                    <span className="text-[#1a1a2e] text-lg font-semibold">Automated orders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#E67A50] mr-3 mt-1 flex-shrink-0" fill="#E67A50" />
                    <span className="text-[#1a1a2e] text-lg font-semibold">Faster service</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#E67A50] mr-3 mt-1 flex-shrink-0" fill="#E67A50" />
                    <span className="text-[#1a1a2e] text-lg font-semibold">Staff efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#E67A50] mr-3 mt-1 flex-shrink-0" fill="#E67A50" />
                    <span className="text-[#1a1a2e] text-lg font-semibold">Zero commission fees</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Restaurants Choose Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              Why Restaurants Choose MenuOS
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-md rounded-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">Easy Installation</h3>
                <p className="text-[#1a1a2e] text-base leading-relaxed">
                  Setup in 15 minutes. Upload your menu, generate QR codes, and start accepting orders immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md rounded-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">No Commission Fees</h3>
                <p className="text-[#1a1a2e] text-base leading-relaxed">
                  Unlike DoorDash or Uber Eats, MenuOS charges only $19/month flat rate. Keep 100% of your revenue.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md rounded-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">QR Code Ordering</h3>
                <p className="text-[#1a1a2e] text-base leading-relaxed">
                  Customers scan QR codes at their table and place orders directly. No app downloads required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Schedule Personal Demo Section */}
        <div className="mb-24">
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-8">
              <h2 className="text-4xl font-bold text-[#1a1a2e] mb-8 text-center">
                Schedule Your Personal Demo
              </h2>
              <div className="bg-white rounded-lg p-6">
                <div className="relative w-full" style={{ paddingBottom: '75%', minHeight: '600px' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://calendly.com/5ha5hank/availability?embed=true&embed_domain=menupro.app&embed_type=Inline"
                    title="Schedule Demo with MenuOS Team"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How Easy is Integration Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              How Easy Is MenuOS Integration?
            </h2>
          </div>
          
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Dashed connecting line for desktop */}
              <div className="hidden md:block absolute top-8 left-16 right-16 h-0.5 border-t-2 border-dashed border-gray-300"></div>
              
              {/* Step 1 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Sign Up</h3>
                <p className="text-[#1a1a2e] text-sm">
                  Create your account in minutes
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Configure Menu</h3>
                <p className="text-[#1a1a2e] text-sm">
                  Upload your menu and generate QR codes
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Start Taking Orders</h3>
                <p className="text-[#1a1a2e] text-sm">
                  Customers scan and order instantly
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative text-center z-10">
                <div className="w-16 h-16 bg-[#E67A50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-white" fill="white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Scale & Optimize</h3>
                <p className="text-[#1a1a2e] text-sm">
                  Monitor sales and optimize operations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* More Efficient Stats Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">
              MenuOS Makes Your Restaurant More Efficient
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-[#E67A50] mb-4">50%</div>
              <p className="text-[#1a1a2e] text-lg font-normal">Faster Order Processing</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-[#E67A50] mb-4">75%</div>
              <p className="text-[#1a1a2e] text-lg font-normal">Reduced Wait Times</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-[#E67A50] mb-4">100%</div>
              <p className="text-[#1a1a2e] text-lg font-normal">Revenue Retention</p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mb-24">
          <Card className="bg-[#1a1a2e] border-0">
            <CardContent className="p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Join thousands of restaurants already using MenuOS to streamline their operations
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  className="bg-[#E67A50] hover:bg-[#d4693f] text-white text-lg px-8 py-6 font-semibold"
                  asChild
                >
                  <Link href="/" className="flex items-center">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a2e] text-lg px-8 py-6 font-semibold"
                  asChild
                >
                  <Link href="https://calendly.com/5ha5hank/availability" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Schedule Demo
                    <Users className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Column 1 - Branding */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/menupro-logo.svg"
                  alt="MenuOS Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold">
                  <span className="text-white">Menu</span>
                  <span className="text-[#E67A50]">OS</span>
                </span>
              </div>
              <p className="text-white/70 text-sm">
                The best restaurant CMS for digital menus and QR ordering.
              </p>
            </div>

            {/* Column 2 - Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Features</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Pricing</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Demo</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Integrations</Link></li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">About</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Blog</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Careers</Link></li>
                <li><Link href="/" className="text-white/70 hover:text-white text-sm">Contact</Link></li>
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
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/menuos.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Follow us on X (Twitter)"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/menuos-app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
