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
    question: "How does MenuOS work?",
    answer: "Customers scan a QR code at their table using their smartphone, browse your digital menu, and place orders directly. No need for waiters to take orders - customers order what they want, when they want it."
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
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Common Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about MenuOS
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="border border-yellow-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4">
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
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg rounded-full"
          >
            Get Notified When We Launch
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Be the first to know when MenuOS is available
          </p>
        </div>
      </div>
    </section>
  );
}