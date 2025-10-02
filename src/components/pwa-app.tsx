'use client'

import { useState } from "react";
import { OnboardingScreen } from "./pwa/onboarding-screen";
import { QRScanScreen } from "./pwa/qr-scan-screen";
import { EmailVerificationScreen } from "./pwa/email-verification-screen";
import { OTPVerificationScreen } from "./pwa/otp-verification-screen";
import { MenuScreen } from "./pwa/menu-screen";
import { ItemDetailScreen } from "./pwa/item-detail-screen";
import { CartScreen } from "./pwa/cart-screen";
import { OrderConfirmationScreen } from "./pwa/order-confirmation-screen";

export type Screen = 'onboarding' | 'qr-scan' | 'email-verification' | 'otp-verification' | 'menu' | 'item-detail' | 'cart' | 'order-confirmation';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages';
  options?: {
    size?: string[];
    customizations?: string[];
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: {
    size?: string;
    customizations?: string[];
  };
}

export function PWAApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [authToken, setAuthToken] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const selectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentScreen('item-detail');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id && 
          JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prev, item];
    });
  };

  const updateCartItem = (itemId: string, quantity: number, selectedOptions?: any) => {
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity, selectedOptions } : item
    ).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleEmailVerified = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('otp-verification');
  };

  const handleOTPVerified = (token: string) => {
    setAuthToken(token);
    // Store token in localStorage for API calls
    localStorage.setItem('authToken', token);
    setCurrentScreen('menu');
  };

  const handleOrderCreated = (orderId: string) => {
    setOrderNumber(orderId);
    setCurrentScreen('order-confirmation');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onComplete={() => navigateToScreen('qr-scan')} />;
      case 'qr-scan':
        return <QRScanScreen onScanComplete={() => navigateToScreen('email-verification')} />;
      case 'email-verification':
        return <EmailVerificationScreen 
          onEmailVerified={handleEmailVerified}
          onBack={() => navigateToScreen('qr-scan')}
        />;
      case 'otp-verification':
        return <OTPVerificationScreen 
          email={userEmail}
          onVerificationSuccess={handleOTPVerified}
          onBack={() => navigateToScreen('email-verification')}
          onResendEmail={() => navigateToScreen('email-verification')}
        />;
      case 'menu':
        return <MenuScreen onSelectItem={selectItem} onViewCart={() => navigateToScreen('cart')} cartItems={cart} />;
      case 'item-detail':
        return <ItemDetailScreen 
          item={selectedItem!} 
          onAddToCart={addToCart}
          onBack={() => navigateToScreen('menu')}
          onViewCart={() => navigateToScreen('cart')}
        />;
      case 'cart':
        return <CartScreen 
          cartItems={cart}
          onUpdateItem={updateCartItem}
          onBack={() => navigateToScreen('menu')}
          onCheckout={() => handleOrderCreated('ORD' + Math.random().toString(36).substr(2, 8).toUpperCase())}
        />;
      case 'order-confirmation':
        return <OrderConfirmationScreen 
          orderNumber={orderNumber}
          estimatedTime="15-20 minutes"
          onNewOrder={() => {
            clearCart();
            navigateToScreen('menu');
          }}
          onBackToLanding={() => window.location.reload()}
        />;
      default:
        return <OnboardingScreen onComplete={() => navigateToScreen('qr-scan')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {renderScreen()}
    </div>
  );
}