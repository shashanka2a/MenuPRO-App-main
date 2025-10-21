'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Shield, ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";
import Image from "next/image";

interface RestaurantOTPScreenProps {
  email: string;
  onVerificationSuccess: (token: string) => void;
  onBack: () => void;
  onResendEmail: () => void;
}

export function RestaurantOTPScreen({ 
  email, 
  onVerificationSuccess, 
  onBack, 
  onResendEmail 
}: RestaurantOTPScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Mock OTP verification - accept "123456" as valid code
      if (otpCode === "123456") {
        setSuccess(true);
        setTimeout(() => {
          onVerificationSuccess("mock-restaurant-token-123456");
        }, 1500);
      } else {
        setError("Invalid verification code. Please enter 123456 for demo purposes.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Mock resend - just reset the form
      await new Promise(resolve => setTimeout(resolve, 500));
      setTimeLeft(600);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="w-full max-w-md mx-auto text-center">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-600">
                  Welcome to MenuOS! Let&apos;s set up your restaurant dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
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
              src="/menupro-logo.png"
              alt="MenuOS Logo"
              width={60}
              height={60}
              className="w-15 h-15"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
          <p className="text-gray-600 mb-2">
            We sent a 6-digit code to:
          </p>
          <p className="font-medium text-orange-600">{email}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> Enter <code className="bg-blue-100 px-1 rounded">123456</code> to continue
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <Card className="mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-xl"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Timer and Resend */}
        <div className="space-y-4">
          {!canResend ? (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Code expires in {formatTime(timeLeft)}</span>
            </div>
          ) : (
            <Button
              onClick={handleResend}
              disabled={isLoading}
              variant="outline"
              className="text-orange-600 border-orange-600 hover:bg-orange-50 flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Resend Code
            </Button>
          )}

          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurant Info
          </Button>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            🔒 This verification helps secure your restaurant account and prevents unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
}
