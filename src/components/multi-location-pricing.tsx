'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Check } from "lucide-react";
import { CustomPricingModal } from "./custom-pricing-modal";

interface MultiLocationPricingProps {
  onGetQuote: (data: any) => void;
}

type BillingCycle = 'monthly' | 'annual'

export function MultiLocationPricing({ onGetQuote }: MultiLocationPricingProps) {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [showCustomPricing, setShowCustomPricing] = useState(false)

  const formatPrice = (opts: { monthly?: number; annual?: number; suffix?: string }) => {
    if (billing === 'monthly' && opts.monthly !== undefined) {
      return { value: `$${opts.monthly}`, period: 'per month', originalValue: null }
    }
    const rawAnnual = opts.annual !== undefined ? opts.annual : (opts.monthly ? opts.monthly * 12 : 0)
    const annualValue = Math.round(rawAnnual * 0.8)
    return { value: `$${annualValue}`, period: 'per year', originalValue: `$${rawAnnual}` }
  }

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: billing === 'monthly'
        ? { value: '$19', period: 'per month', originalValue: null }
        : { value: '$180', period: 'per year', originalValue: '$225' },
      features: [
        'QR Code Ordering',
        'Digital Menu Management',
        'Order & Ticket Printing',
        'Basic Analytics',
        'Email Support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billing === 'monthly'
        ? { value: '$15', period: 'per location/month', originalValue: null }
        : { value: '$140', period: 'per location/year', originalValue: '$180' },
      features: [
        'Everything in Starter',
        'Centralized Dashboard',
        'Location-specific Settings',
        'Advanced Analytics',
        'Priority Support',
      ],
    },
  ] as const

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a2e] font-sans">
            Simple, Transparent Pricing
          </h2>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 border border-gray-200 p-1">
            <button
              aria-label="Monthly billing"
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-sans ${
                billing === 'monthly' 
                  ? 'bg-[#FF6B00] text-white' 
                  : 'text-[#1a1a2e] hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              aria-label="Annual billing"
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-sans ${
                billing === 'annual' 
                  ? 'bg-[#FF6B00] text-white' 
                  : 'text-[#1a1a2e] hover:bg-gray-200'
              }`}
            >
              Annual <span className={`ml-1 text-xs font-semibold ${billing === 'annual' ? 'text-green-200' : 'text-green-600'}`}>(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Two Pricing Cards Side-by-Side */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="bg-white rounded-lg shadow-lg border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Orange Header Bar */}
              <div className="bg-[#FF6B00] py-4 px-6">
                <h3 className="text-2xl font-bold text-white font-sans text-center">
                  {plan.name}
                </h3>
              </div>

              <CardHeader className="text-center pb-4 pt-8">
                <div className="mb-2">
                  {plan.price.originalValue && (
                    <span className="text-2xl font-bold text-gray-400 line-through mr-2 font-sans">{plan.price.originalValue}</span>
                  )}
                  <span className="text-5xl font-extrabold text-[#1a1a2e] font-sans">{plan.price.value}</span>
                  <span className="text-gray-600 ml-2 font-sans">{plan.price.period}</span>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-[#1a1a2e] font-sans">
                      <Check className="w-5 h-5 text-[#FF6B00] mr-3 mt-0.5 flex-shrink-0" fill="#FF6B00" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full bg-[#FF6B00] hover:bg-[#e55a00] text-white font-sans font-semibold py-6 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Quote Question */}
        <div className="text-center mt-12">
          <p className="text-base text-gray-600 font-sans">
            Have multiple locations or need help choosing a plan?{' '}
            <button
              onClick={() => setShowCustomPricing(true)}
              className="text-[#FF6B00] underline hover:text-[#e55a00] font-medium"
            >
              Try our custom pricing
            </button>
          </p>
        </div>
      </div>

      {/* Custom Pricing Modal */}
      <CustomPricingModal
        isOpen={showCustomPricing}
        onClose={() => setShowCustomPricing(false)}
        onGetQuote={onGetQuote}
      />
    </section>
  );
}
