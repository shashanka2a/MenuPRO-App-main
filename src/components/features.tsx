'use client'

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Smartphone, ShoppingCart, CheckCircle } from "lucide-react";

interface FeaturesProps {
  onLaunchApp: () => void;
}

const features = [
  {
    step: "01",
    icon: Smartphone,
    title: "QR Code Ordering",
    description: "No more waiting for servers. Customers scan QR codes to access your digital menu instantly from their phones.",
    painPoint: "Eliminate paper menus forever"
  },
  {
    step: "02", 
    icon: ShoppingCart,
    title: "Real-time Order Management",
    description: "Cut order errors significantly. Track orders in real-time, manage inventory, and streamline your kitchen operations.",
    painPoint: "Reduce order mistakes & kitchen chaos"
  },
  {
    step: "03",
    icon: CheckCircle,
    title: "No Commission Fees",
    description: "Keep 100% of your revenue. Our flat $19/month subscription means no hidden fees eating into your profits.",
    painPoint: "Stop losing money to commission fees"
  }
];

export function Features({ onLaunchApp }: FeaturesProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Why Choose MenuPRO?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to modernize your restaurant operations and boost revenue
        </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white">
              <CardContent className="pt-6">
                <div className="mb-6 relative">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-10 h-10 text-orange-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {feature.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-orange-600 font-semibold mb-3">{feature.painPoint}</p>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Button 
                  onClick={onLaunchApp}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full"
                >
                  Try It Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>
    </section>
  );
}