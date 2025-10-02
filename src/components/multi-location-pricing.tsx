'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Star } from "lucide-react";
import { CustomPricingModal } from "./custom-pricing-modal";

interface MultiLocationPricingProps {
  onGetQuote: (data: any) => void;
}

type BillingCycle = 'monthly' | 'annual'

export function MultiLocationPricing({ onGetQuote }: MultiLocationPricingProps) {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const [showCustomPricing, setShowCustomPricing] = useState(false)

  // Helper to format prices based on billing cycle
  const formatPrice = (opts: { monthly?: number; annual?: number; suffix?: string }) => {
    if (billing === 'monthly' && opts.monthly !== undefined) {
      return { value: `$${opts.monthly}`, period: 'per month' }
    }
    // 20% discount on annual
    const rawAnnual = opts.annual !== undefined ? opts.annual : (opts.monthly ? opts.monthly * 12 : 0)
    const annualValue = Math.round(rawAnnual * 0.8)
    return { value: `$${annualValue}`, period: 'per year' }
  }

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: formatPrice({ monthly: 19 }),
      note: 'Single Location',
      features: [
        'QR Code Ordering',
        'Digital Menu Management',
        'Order & Ticket Printing',
        'Basic Analytics',
        'Email Support',
      ],
      popular: false,
    },
    {
      id: 'growth',
      name: 'Growth',
      // $15/location/month → $180/location/year
      price: billing === 'monthly'
        ? { value: '$15', period: 'per location/month' }
        : { value: '$180', period: 'per location/year' },
      note: 'Multi-Location',
      features: [
        'Everything in Starter',
        'Centralized Dashboard',
        'Location-specific Settings',
        'Advanced Analytics',
        'Priority Support',
      ],
      popular: true,
    },
  ] as const

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">Simple, Transparent Pricing</h2>
          <p className="text-lg md:text-xl text-gray-600">Flat, transparent pricing. No hidden fees or commissions.</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 p-1">
            <button
              aria-label="Monthly billing"
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Monthly
            </button>
            <button
              aria-label="Annual billing"
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billing === 'annual' ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Annual <span className="ml-1 text-xs font-semibold text-green-600">(Save 20%)</span>
            </button>
              </div>
        </div>

        {/* Pricing Cards - 3 Plans */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-xl border ${
                plan.id === 'growth'
                  ? (billing === 'annual'
                      ? 'border-orange-300 ring-2 ring-orange-200'
                      : 'border-orange-200')
                  : (billing === 'monthly' && plan.id === 'starter' ? 'border-orange-200' : 'border-gray-200')
              }`}
            >
              {plan.id === 'growth' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-orange-600 text-white px-3 py-1"><Star className="w-4 h-4 mr-1" /> Most Popular</Badge>
                    </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-extrabold text-orange-600">{plan.price.value}</span>
                  <span className="text-gray-600 ml-2">{plan.price.period}</span>
                </div>
                <p className="text-sm text-gray-500">{plan.note}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-2" /> {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Get Started</Button>
            </CardContent>
          </Card>
          ))}
        </div>

        {/* Custom Quote Question */}
        <div className="text-center mt-8">
          <p className="text-base text-gray-600">
            Have multiple locations or need help choosing a plan?{' '}
            <button
              onClick={() => setShowCustomPricing(true)}
              className="text-orange-600 underline hover:text-orange-700 font-medium"
            >
              Try our custom pricing
            </button>
          </p>
        </div>

        {/* All Features Included note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">All Features Included • No setup fees • Cancel anytime</p>
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