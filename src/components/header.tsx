'use client'

import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onLaunchApp: () => void;
  onRestaurantSignup?: () => void;
}

export function Header({ onLaunchApp, onRestaurantSignup }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo-icon.svg"
            alt="MenuPRO Icon"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-orange-600">MenuPRO</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors">Pricing</a>
          <a href="#faq" className="text-gray-600 hover:text-orange-600 transition-colors">FAQ</a>
          <div className="flex items-center space-x-3">
            {onRestaurantSignup && (
              <Button 
                onClick={onRestaurantSignup}
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Restaurant Signup
              </Button>
            )}
            <Button 
              onClick={onLaunchApp}
              variant="outline" 
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            >
              Get Started
            </Button>
          </div>
        </nav>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}