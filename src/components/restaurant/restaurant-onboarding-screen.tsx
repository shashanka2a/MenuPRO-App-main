'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mail, ArrowLeft, CheckCircle, Building2, MapPin, Phone, Clock } from "lucide-react";
import Image from "next/image";

interface RestaurantOnboardingScreenProps {
  onEmailVerified: (email: string, restaurantData: RestaurantData) => void;
  onBack: () => void;
}

interface RestaurantData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cuisine: string;
  description: string;
  operatingHours: {
    open: string;
    close: string;
  };
}

export function RestaurantOnboardingScreen({ onEmailVerified, onBack }: RestaurantOnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cuisine: "",
    description: "",
    operatingHours: {
      open: "09:00",
      close: "22:00"
    }
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurantData.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(restaurantData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Mock email sending - just show success after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      localStorage.setItem('pendingRestaurantEmail', restaurantData.email);
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToOTP = () => {
    onEmailVerified(restaurantData.email, restaurantData);
  };

  const updateRestaurantData = (field: keyof RestaurantData, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateOperatingHours = (field: 'open' | 'close', value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [field]: value
      }
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/menupro-logo.png"
                alt="MenuPRO Logo"
                width={60}
                height={60}
                className="w-15 h-15"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          </div>

          {/* Success Card */}
          <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Email Sent!</h2>
                <p className="text-gray-600 mb-4">
                  We&apos;ve sent a verification code to:
                </p>
                <p className="font-medium text-orange-600 mb-6">{restaurantData.email}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Please check your inbox and spam folder. The code will expire in 10 minutes.
                </p>
                <Button
                  onClick={handleProceedToOTP}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl"
                >
                  Enter Verification Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resend Option */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive the email?</p>
            <button
              onClick={() => setSuccess(false)}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              Try a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/menupro-logo.png"
              alt="MenuPRO Logo"
              width={60}
              height={60}
              className="w-15 h-15"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MenuPRO</h1>
          <p className="text-gray-600">Let&apos;s get your restaurant set up with digital ordering</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-3 text-orange-600" />
                Restaurant Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="restaurantName" className="text-sm font-medium text-gray-700">
                    Restaurant Name *
                  </Label>
                  <Input
                    id="restaurantName"
                    value={restaurantData.name}
                    onChange={(e) => updateRestaurantData('name', e.target.value)}
                    placeholder="Enter your restaurant name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={restaurantData.email}
                      onChange={(e) => updateRestaurantData('email', e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      value={restaurantData.phone}
                      onChange={(e) => updateRestaurantData('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cuisine" className="text-sm font-medium text-gray-700">
                    Cuisine Type *
                  </Label>
                  <Select value={restaurantData.cuisine} onValueChange={(value) => updateRestaurantData('cuisine', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!restaurantData.name || !restaurantData.email || !restaurantData.phone || !restaurantData.cuisine}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location & Hours */}
        {step === 2 && (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-orange-600" />
                Location & Hours
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    value={restaurantData.address}
                    onChange={(e) => updateRestaurantData('address', e.target.value)}
                    placeholder="Enter your street address"
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={restaurantData.city}
                      onChange={(e) => updateRestaurantData('city', e.target.value)}
                      placeholder="City"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State *
                    </Label>
                    <Input
                      id="state"
                      value={restaurantData.state}
                      onChange={(e) => updateRestaurantData('state', e.target.value)}
                      placeholder="State"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zipCode"
                      value={restaurantData.zipCode}
                      onChange={(e) => updateRestaurantData('zipCode', e.target.value)}
                      placeholder="ZIP"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-4 block">
                    Operating Hours *
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Open:</span>
                      <Input
                        type="time"
                        value={restaurantData.operatingHours.open}
                        onChange={(e) => updateOperatingHours('open', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Close:</span>
                      <Input
                        type="time"
                        value={restaurantData.operatingHours.close}
                        onChange={(e) => updateOperatingHours('close', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Restaurant Description
                  </Label>
                  <Textarea
                    id="description"
                    value={restaurantData.description}
                    onChange={(e) => updateRestaurantData('description', e.target.value)}
                    placeholder="Tell customers about your restaurant..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!restaurantData.address || !restaurantData.city || !restaurantData.state || !restaurantData.zipCode}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Email Verification */}
        {step === 3 && (
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-orange-600" />
                Verify Your Email
              </h2>
              
              <div className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Almost there!</h3>
                  <p className="text-orange-700 text-sm">
                    We&apos;ll send a verification code to <strong>{restaurantData.email}</strong> to confirm your restaurant account.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-xl"
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </form>
              </div>

              <div className="flex justify-start mt-8">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl"
                >
                  Previous
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
}
