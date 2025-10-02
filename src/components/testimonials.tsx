'use client'

import { Card, CardContent } from "./ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Restaurant Owner",
    restaurant: "Bella Vista Bistro",
    content: "MenuPRO has increased our revenue while reducing operational costs. The $19/month fee is nothing compared to the commission we were paying before!",
    rating: 5,
    avatar: "SJ",
    logo: "🍽️"
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Restaurant Owner",
    restaurant: "Golden Dragon",
    content: "Since implementing MenuPRO, our order accuracy has improved significantly and customer satisfaction is at an all-time high. The analytics help us make better business decisions.",
    rating: 5,
    avatar: "MC",
    logo: "🐉"
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Restaurant Owner",
    restaurant: "The Garden Table",
    content: "Finally, a solution that doesn't take a cut of our sales! The flat $19/month fee means we keep 100% of our revenue. It's been a game-changer for our business.",
    rating: 5,
    avatar: "EW",
    logo: "🌿"
  }
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

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join restaurants already using MenuPRO to transform their business
          </p>
        </div>
        
        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="text-center p-8 border-none shadow-lg bg-white max-w-4xl mx-auto">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-lg text-gray-600 mb-6 italic max-w-3xl mx-auto">&ldquo;{testimonial.content}&rdquo;</p>
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl mr-4">
                          {testimonial.logo}
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-lg">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                          <p className="text-sm text-orange-600 font-medium">{testimonial.restaurant}</p>
                        </div>
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRight className="w-6 h-6 text-orange-600" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}