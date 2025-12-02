'use client'

import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onLaunchApp: () => void;
}

export function Header({ onLaunchApp }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
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
        
          {/* Links - Center */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="#services" className="text-[#1a1a2e] hover:text-[#FF6B00] transition-all duration-300 font-sans font-medium hover:scale-105">Features</a>
            <a href="#pricing" className="text-[#1a1a2e] hover:text-[#FF6B00] transition-all duration-300 font-sans font-medium hover:scale-105">Pricing</a>
            <a href="#faq" className="text-[#1a1a2e] hover:text-[#FF6B00] transition-all duration-300 font-sans font-medium hover:scale-105">FAQs</a>
          </nav>
          
          {/* CTAs - Right */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-[#1a1a2e] hover:text-[#FF6B00] hover:bg-transparent font-sans font-medium hidden md:block"
            >
              Login
            </Button>
            <Button 
              onClick={onLaunchApp}
              className="bg-[#FF6B00] hover:bg-[#e55a00] text-white font-sans font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-[#1a1a2e]" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
