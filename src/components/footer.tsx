import { Facebook, Twitter, Instagram, Linkedin, Shield, Award, Users } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Social Proof Section */}
        <div className="text-center mb-12 pb-8 border-b border-gray-800">
          <h3 className="text-2xl font-bold mb-6">Trusted by Restaurants</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">SOC2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Best Restaurant Tech 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Growing Community</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/menupro-logo.svg"
                alt="MenuOS Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h3 className="text-2xl font-bold text-orange-600">MenuOS</h3>
            </div>
            <p className="text-gray-400 mb-4">
              The complete digital ordering solution for modern restaurants. No commission fees, just results.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Demo</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-orange-600 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MenuOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}