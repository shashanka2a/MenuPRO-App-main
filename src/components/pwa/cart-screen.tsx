'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, Plus, Minus, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import { CartItem } from "../pwa-app";

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateItem: (itemId: string, quantity: number, selectedOptions?: any) => void;
  onBack: () => void;
  onCheckout: (orderId: string) => void;
}

export function CartScreen({ cartItems, onUpdateItem, onBack, onCheckout }: CartScreenProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + tax;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon("SAVE10");
      setCouponCode("");
    } else {
      // Show error message in real app
      setCouponCode("");
    }
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    onUpdateItem(item.id, newQuantity, item.selectedOptions);
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions
        }))
      };

      // Submit order
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const data = await response.json();
        onCheckout(data.order.id);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center p-4">
            <Button
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="rounded-full p-2 mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Image
                src="/menupro-logo.svg"
                alt="MenuOS Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <h1 className="text-lg font-semibold text-gray-900">Your Cart</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[60vh] p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started</p>
            <Button 
              onClick={onBack}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl"
            >
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center p-4">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm"
            className="rounded-full p-2 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Image
              src="/menupro-logo.svg"
              alt="MenuOS Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h1 className="text-lg font-semibold text-gray-900">Your Cart ({cartItems.length} items)</h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-40">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item, index) => (
            <Card key={`${item.id}-${index}`} className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    {item.selectedOptions?.size && (
                      <Badge variant="outline" className="text-xs mb-1 mr-2">
                        {item.selectedOptions.size}
                      </Badge>
                    )}
                    {item.selectedOptions?.customizations && item.selectedOptions.customizations.length > 0 && (
                      <div className="text-xs text-gray-600 mb-2">
                        + {item.selectedOptions.customizations.join(", ")}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">${(item.price * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          variant="outline"
                          size="sm"
                          className="rounded-full w-8 h-8 p-0"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <Button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          variant="outline"
                          size="sm"
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coupon Section */}
        <Card className="mb-6 border-none shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Coupon Code</h3>
            </div>
            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">✓ SAVE10 Applied</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleApplyCoupon}
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                >
                  Apply
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Try &quot;SAVE10&quot; for 10% off</p>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (SAVE10)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button 
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-4 rounded-xl"
          size="lg"
        >
          {isSubmitting ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}