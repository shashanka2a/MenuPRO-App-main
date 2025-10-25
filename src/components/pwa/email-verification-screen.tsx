'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";

interface EmailVerificationScreenProps {
  onEmailVerified: (email: string) => void;
  onBack: () => void;
}

export function EmailVerificationScreen({ onEmailVerified, onBack }: EmailVerificationScreenProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Mock email sending - just show success after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      // Store email in localStorage for OTP verification
      localStorage.setItem('pendingEmail', email);
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToOTP = () => {
    onEmailVerified(email);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/menupro-logo.svg"
                alt="MenuOS Logo"
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
                <p className="font-medium text-orange-600 mb-6">{email}</p>
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
      <div className="w-full max-w-md mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/menupro-logo.svg"
              alt="MenuOS Logo"
              width={60}
              height={60}
              className="w-15 h-15"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">We&apos;ll send you a verification code to prevent spam orders</p>
        </div>

        {/* Email Form */}
        <Card className="mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10 py-3 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-xl"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to QR Scan
        </Button>

        {/* Privacy Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            🔒 Your email is only used for order verification and will not be shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
