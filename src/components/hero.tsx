'use client'

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Link from "next/link";

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
        {/* Stronger dark overlay for better text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
          }}
        />
      </div>
      
      {/* Content - Centered, All White */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in">
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-sans animate-slide-up"
          style={{ textShadow: '0px 2px 8px rgba(0,0,0,0.6)' }}
        >
          Digital Menu OS for Restaurants
        </h1>
        <p
          className="text-lg md:text-xl mb-10 text-white font-sans font-normal max-w-2xl mx-auto leading-relaxed animate-slide-up-delay"
          style={{ textShadow: '0px 1px 4px rgba(0,0,0,0.5)' }}
        >
          Simplify operations, enhance customer experience, and boost efficiency with our all-in-one platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up-delay-2">
          <Button 
            onClick={onLaunchApp}
            size="lg" 
            className="bg-[#FF6B00] hover:bg-[#e55a00] text-white px-10 py-6 text-lg font-sans font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-[#1a1a2e] px-10 py-6 text-lg font-sans font-semibold rounded-lg bg-transparent transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link href="/demo">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
