'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle, ArrowLeft, RefreshCw, Bell } from "lucide-react";
import Image from "next/image";

interface OrderConfirmationScreenProps {
  orderNumber: string;
  estimatedTime: string;
  onNewOrder: () => void;
  onBackToLanding: () => void;
}

export function OrderConfirmationScreen({ 
  orderNumber, 
  estimatedTime, 
  onNewOrder, 
  onBackToLanding 
}: OrderConfirmationScreenProps) {
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifyStaff = () => {
    setIsNotified(true);
    // In a real app, this would send a notification to restaurant staff
    console.log('Staff notified of new order');
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Your order has been sent to the kitchen</p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              {/* Order Number */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">#{orderNumber}</p>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Estimated Time: {estimatedTime}</span>
              </div>

              {/* Status Badge */}
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2">
                Order Received
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="mb-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-left">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">1</span>
                </div>
                <p className="text-sm text-gray-600">Kitchen receives your order instantly</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">2</span>
                </div>
                <p className="text-sm text-gray-600">Chef starts preparing your food</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">3</span>
                </div>
                <p className="text-sm text-gray-600">Server brings your order to the table</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleNotifyStaff}
            disabled={isNotified}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center"
          >
            {isNotified ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Staff Notified
              </>
            ) : (
              <>
                <Bell className="w-5 h-5 mr-2" />
                Notify Staff
              </>
            )}
          </Button>
          
          <Button 
            onClick={onNewOrder}
            variant="outline"
            className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-xl flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Order More Items
          </Button>
          
          <Button 
            onClick={onBackToLanding}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800 py-3 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Landing
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>Pro tip:</strong> You can order more items anytime during your meal!
          </p>
        </div>
      </div>
    </div>
  );
}
