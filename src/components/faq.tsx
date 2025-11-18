'use client'

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQProps {
  onLaunchApp: () => void;
}

const faqs = [
  {
    question: "How easy is MenuOS integration?",
    answer: "MenuOS is designed for easy integration. Simply upload your menu, generate QR codes, and start accepting orders. The entire setup process takes less than 15 minutes with no technical expertise required."
  },
  {
    question: "What are the benefits for customers?",
    answer: "Customers can add allergy information, special dietary requirements, and specific cooking instructions that waiters might forget. They can also see detailed menu descriptions, photos, and customize their orders exactly how they want them."
  },
  {
    question: "How do customers pay?",
    answer: "Customers pay directly through the app when they check out. Payment processing is coming soon - for now, customers can place orders and pay at the table or counter as usual."
  },
  {
    question: "Do I need any special equipment?",
    answer: "No special equipment needed! Customers use their own smartphones to scan QR codes and place orders. You just need a device to manage orders (tablet, phone, or computer)."
  },
  {
    question: "What if customers don't have smartphones?",
    answer: "We provide backup options including printed menus with QR codes and staff-assisted ordering. Our system works on any device with a camera and internet connection."
  },
  {
    question: "When will MenuOS be available?",
    answer: "MenuOS is launching soon! We're currently in development and will be available for restaurants to start using in the coming months. Sign up to be notified when we launch."
  }
];

export function FAQ({ onLaunchApp }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-[#f7f7f7]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a2e] font-sans">
            Common Questions
          </h2>
        </div>

        {/* FAQ Items - Accordion Style */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
                >
                  <span className="text-lg font-bold text-[#1a1a2e] font-sans pr-4">
                    {faq.question}
                  </span>
                  <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-[#1a1a2e] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#1a1a2e] flex-shrink-0" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 border-t border-gray-100 animate-slide-up">
                    <p className="text-[#1a1a2e] leading-relaxed pt-4 font-sans">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={onLaunchApp}
            size="lg"
            className="bg-[#FF6B00] hover:bg-[#e55a00] text-white px-10 py-6 text-lg font-sans font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Contact Our Team
          </Button>
        </div>
      </div>
    </section>
  );
}
