import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Smartphone, ShoppingCart, CheckCircle } from "lucide-react";
import Image from "next/image";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Smartphone,
    title: "Scan QR",
    description: "Scan the QR code at your table to get started"
  },
  {
    icon: ShoppingCart,
    title: "Browse & Select",
    description: "Explore our menu and add items to your cart"
  },
  {
    icon: CheckCircle,
    title: "Review & Confirm",
    description: "Review your order and complete payment"
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex justify-center mb-4">
            <Image
              src="/menupro-logo.png"
              alt="MenuOS Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MenuOS</h1>
          <p className="text-gray-600">Digital Menu Experience</p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
              <CardContent className="flex items-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <step.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onComplete}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl"
          size="lg"
        >
          Get Started
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          Welcome to the future of dining
        </p>
      </div>
    </div>
  );
}