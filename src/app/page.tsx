'use client'

import { useState } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MenuGrid } from "@/components/menu-grid";
import { MultiLocationPricing } from "@/components/multi-location-pricing";
// import { HowItWorks } from "@/components/how-it-works";
import { FAQ } from "@/components/faq";
// import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { PWAApp } from "@/components/pwa-app";
import { RestaurantApp } from "@/components/restaurant/restaurant-app";

export default function Home() {
  const [showPWA, setShowPWA] = useState(false);
  const [showRestaurant, setShowRestaurant] = useState(false);

  if (showPWA) {
    return <PWAApp />;
  }

  if (showRestaurant) {
    return <RestaurantApp />;
  }

  return (
    <div className="min-h-screen">
      <Header 
        onLaunchApp={() => setShowRestaurant(true)} 
      />
      <main>
        <Hero onLaunchApp={() => setShowRestaurant(true)} />
        <section id="services">
          <MenuGrid />
        </section>
        <section id="pricing">
          <MultiLocationPricing onGetQuote={(data) => {
            console.log('Pricing quote requested:', data);
            // Handle quote request
          }} />
        </section>
        <section id="faq">
          <FAQ onLaunchApp={() => setShowRestaurant(true)} />
        </section>
        {/* <section id="testimonials">
          <Testimonials />
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
