'use client'

import { useState } from "react";
import { Card, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { 
  QrCode, 
  Smartphone, 
  Upload, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Camera,
  FileText,
  Settings,
  Bell
} from "lucide-react";
import Image from "next/image";

interface HowItWorksProps {
  onLaunchApp: () => void;
}

export function HowItWorks({ onLaunchApp }: HowItWorksProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'setup',
      title: '1. Quick Setup',
      subtitle: 'Get started in minutes',
      description: 'Sign up with your restaurant details, verify your email, and upload your menu using our AI-powered OCR or PDF parsing.',
      icon: Upload,
      features: ['Email verification', 'Menu upload (OCR/PDF)', 'Restaurant profile setup'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'customize',
      title: '2. Customize & Deploy',
      subtitle: 'Make it yours',
      description: 'Customize your digital menu, set up QR codes for each table, and configure your restaurant settings.',
      icon: Settings,
      features: ['QR code generation', 'Menu customization', 'Table management'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'orders',
      title: '3. Receive Orders',
      subtitle: 'Customers order instantly',
      description: 'Customers scan QR codes, browse your menu, and place orders directly from their phones. No apps to download.',
      icon: QrCode,
      features: ['QR code scanning', 'Mobile ordering', 'Real-time notifications'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'manage',
      title: '4. Manage & Track',
      subtitle: 'Complete control',
      description: 'Track orders in real-time, manage inventory, view analytics, and grow your business with actionable insights.',
      icon: BarChart3,
      features: ['Order management', 'Analytics dashboard', 'Inventory tracking'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Setup in 15 Minutes',
      description: 'From signup to first order in under 15 minutes'
    },
    {
      icon: Users,
      title: 'No Customer Apps',
      description: 'Customers order directly from their browser'
    },
    {
      icon: CheckCircle,
      title: 'Zero Commission',
      description: 'Keep 100% of your revenue with flat pricing'
    }
  ];

  const competitors = [
    {
      name: 'Square',
      price: '$69+/month',
      features: ['POS system', 'Payment processing', 'Inventory management'],
      limitations: ['High transaction fees', 'Complex setup', 'Limited customization']
    },
    {
      name: 'Toast',
      price: '$79+/month',
      features: ['Full POS', 'Kitchen display', 'Customer management'],
      limitations: ['Expensive', 'Long contracts', 'Steep learning curve']
    },
    {
      name: 'MenuOS',
      price: '$19/month',
      features: ['QR ordering', 'No commission', 'Easy setup'],
      advantages: ['Affordable', 'No contracts', 'Simple to use']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-orange-100 text-orange-800 px-4 py-2 mb-4">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From Setup to Success in 4 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your restaurant with digital ordering in minutes, not months. 
            No complex integrations or expensive hardware required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {steps.map((step, index) => (
            <Card 
              key={step.id}
              className={`border-none shadow-lg transition-all duration-300 hover:shadow-xl ${
                activeStep === index ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setActiveStep(index)}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <step.icon className={`w-8 h-8 ${step.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-lg text-orange-600 font-medium mb-4">{step.subtitle}</p>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Competitive Comparison */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MenuOS Over Square & Toast?
            </h3>
            <p className="text-lg text-gray-600">
              Compare the leading restaurant management solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {competitors.map((competitor, index) => (
              <Card key={index} className={`border-none shadow-lg ${
                competitor.name === 'MenuOS' ? 'ring-2 ring-orange-500 bg-orange-50' : 'bg-white'
              }`}>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{competitor.name}</h4>
                    <div className="text-3xl font-bold text-orange-600 mb-4">{competitor.price}</div>
                    {competitor.name === 'MenuOS' && (
                      <Badge className="bg-orange-100 text-orange-800">Best Value</Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Key Features:</h5>
                      <ul className="space-y-1">
                        {competitor.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {competitor.name === 'MenuOS' ? 'Advantages:' : 'Limitations:'}
                      </h5>
                      <ul className="space-y-1">
                        {(competitor.limitations || competitor.advantages).map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                            {competitor.name === 'MenuOS' ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 text-red-500 mr-2 flex-shrink-0">×</div>
                            )}
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Restaurant?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants already using MenuOS to increase revenue, 
            reduce wait times, and provide a better customer experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onLaunchApp}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-xl rounded-full"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 text-xl rounded-full"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
