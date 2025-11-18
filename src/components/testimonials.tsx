'use client'

import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    restaurant: "Bella Vista Bistro",
    content: "MenuOS completely transformed our restaurant operations. We've seen a 50% increase in order accuracy and our customers love the convenience of ordering directly from their phones.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    restaurant: "Golden Dragon",
    content: "Since implementing MenuOS, our table turnover has increased significantly. The analytics dashboard helps us make better business decisions and the flat monthly fee means we keep 100% of our revenue.",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a2e] font-sans">
            Trusted by Restaurant Owners
          </h2>
        </div>
        
        {/* Horizontal Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-white rounded-lg shadow-lg border-0 max-w-4xl mx-auto">
                    <CardContent className="p-12">
                      <p className="text-2xl md:text-3xl text-[#1a1a2e] mb-8 italic font-sans leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="text-left">
                        <p className="font-bold text-xl text-[#1a1a2e] font-sans">
                          - {testimonial.name}, Owner of {testimonial.restaurant}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-[#1a1a2e]" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-[#1a1a2e]" />
          </button>
        </div>
      </div>
    </section>
  );
}
