'use client'

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Image from "next/image";

interface HeroProps {
  onLaunchApp: () => void;
}

export function Hero({ onLaunchApp }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmclMjByb29tJTIwYXV0aGVudGljfGVufDF8fHx8MTc1ODQwMzE4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Authentic restaurant dining room with warm lighting"
          className="w-full h-full object-cover"
        />
        {/* Stronger overlay on mobile, lighter on md+ for better readability */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
          style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}
        >
          Digital Menu Platform for Restaurants
        </h1>
        <p
          className="text-lg md:text-xl mb-6 text-gray-200 font-medium"
          style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.45)' }}
        >
          Scan, Order, and Serve — no tablets, no delays.
        </p>
        <p
          className="text-xl md:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto"
          style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.45)' }}
        >
          Customers order directly from their table. No waiters needed. Add allergies, special instructions, and customize orders exactly how they want them.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button 
            onClick={onLaunchApp}
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-6 text-xl rounded-full shadow-lg shadow-black/20"
          >
            Get Started
          </Button>
          <Button 
            onClick={onLaunchApp}
            size="lg" 
            variant="outline"
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-10 py-6 text-xl rounded-full shadow-md shadow-black/10"
          >
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}