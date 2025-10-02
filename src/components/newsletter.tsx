'use client'

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-red-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 mx-auto mb-6 text-orange-100" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Boost Your Restaurant with Digital Ordering Tips
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Get expert insights, feature updates, and proven strategies to maximize your restaurant&apos;s revenue
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="bg-white text-gray-900 border-none"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-orange-100 mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}