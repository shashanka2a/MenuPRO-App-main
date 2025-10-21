'use client'

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Building2, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp
} from "lucide-react";
import Image from "next/image";

interface RestaurantCTAProps {
  onRestaurantSignup: () => void;
}

export function RestaurantCTA({ onRestaurantSignup }: RestaurantCTAProps) {
  const benefits = [
    {
      icon: DollarSign,
      title: "Save $500+/Month",
      description: "No commission fees vs 2.9% with Square"
    },
    {
      icon: Clock,
      title: "Setup in 15 Minutes",
      description: "From signup to first order in minutes"
    },
    {
      icon: Users,
      title: "500+ Restaurants",
      description: "Join growing community of successful restaurants"
    }
  ];

  const features = [
    "QR Code Ordering System",
    "Real-time Order Management", 
    "Analytics Dashboard",
    "Multi-location Support",
    "No Commission Fees",
    "24/7 Customer Support"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-white/20 text-white px-4 py-2 mb-4">
            For Restaurants
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Join 500+ restaurants already using MenuOS to increase revenue, 
            reduce wait times, and provide a better customer experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-orange-100">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                What You Get:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-300 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - CTA Card */}
          <Card className="border-none shadow-2xl bg-white text-gray-900">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/menupro-logo.png"
                    alt="MenuOS Logo"
                    width={60}
                    height={60}
                    className="w-15 h-15"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Start Your Free Trial
                </h3>
                <p className="text-gray-600">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Monthly Plan</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">$19</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm text-green-800">No Commission Fees</span>
                  <span className="text-sm font-semibold text-green-800">$0</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm text-blue-800">Setup Time</span>
                  <span className="text-sm font-semibold text-blue-800">15 minutes</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onRestaurantSignup}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg rounded-xl"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-xl"
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  ✓ 14-day free trial • ✓ No setup fees • ✓ Cancel anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-orange-100">Active Restaurants</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">35%</div>
            <div className="text-orange-100">Avg. Revenue Increase</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">15min</div>
            <div className="text-orange-100">Average Setup Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-orange-100">Uptime Guarantee</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-orange-100 mb-6">Trusted by restaurants nationwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold">Square Alternative</div>
            <div className="text-2xl font-bold">Toast Alternative</div>
            <div className="text-2xl font-bold">Restaurant CMS</div>
          </div>
        </div>
      </div>
    </section>
  );
}
