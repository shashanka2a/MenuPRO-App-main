import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
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
              <span className="text-2xl font-bold font-sans text-white">
                MenuOS
              </span>
            </div>
            <p className="text-white/70 text-sm font-sans mb-4">
              The complete digital ordering solution for modern restaurants.
            </p>
            <p className="text-white/50 text-sm font-sans">
              © 2024 MenuOS. All rights reserved.
            </p>
          </div>
          
          {/* Column 2 - Product */}
          <div>
            <h4 className="font-bold mb-4 text-white font-sans">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#services" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Features</Link></li>
              <li><Link href="#pricing" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Pricing</Link></li>
              <li><Link href="/demo" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Demo</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">API</Link></li>
            </ul>
          </div>
          
          {/* Column 3 - Company */}
          <div>
            <h4 className="font-bold mb-4 text-white font-sans">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">About</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Blog</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Careers</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 4 - Support */}
          <div>
            <h4 className="font-bold mb-4 text-white font-sans">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#faq" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Help Center</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Documentation</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Community</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 text-sm font-sans hover:translate-x-1 inline-block">Status</Link></li>
            </ul>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://linkedin.com/company/menuos-app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 hover:scale-110"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/menuos.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FF6B00] transition-all duration-300 hover:scale-110"
                aria-label="Follow us on X (Twitter)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
