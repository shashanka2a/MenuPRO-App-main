'use client'

import { useState } from "react";
import { RestaurantOnboardingScreen } from "./restaurant-onboarding-screen";
import { RestaurantOTPScreen } from "./restaurant-otp-screen";
import { MenuUploadScreen } from "./menu-upload-screen";
import { TableQRScreen } from "./table-qr-screen";
import { RestaurantDashboard } from "./restaurant-dashboard";

export type RestaurantScreen = 'onboarding' | 'otp-verification' | 'menu-upload' | 'table-qr' | 'dashboard';

export interface RestaurantData {
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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
}

export function RestaurantApp() {
  const [currentScreen, setCurrentScreen] = useState<RestaurantScreen>('onboarding');
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleEmailVerified = (email: string, data: RestaurantData) => {
    setRestaurantData(data);
    setCurrentScreen('otp-verification');
  };

  const handleOTPVerified = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('restaurantAuthToken', token);
    setCurrentScreen('menu-upload');
  };

  const handleMenuUploaded = (items: MenuItem[]) => {
    setMenuItems(items);
    setCurrentScreen('table-qr');
  };

  const handleTableQRComplete = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('restaurantAuthToken');
    setAuthToken('');
    setRestaurantData(null);
    setMenuItems([]);
    setCurrentScreen('onboarding');
  };

  const handleBackToLanding = () => {
    window.location.href = '/';
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <RestaurantOnboardingScreen 
            onEmailVerified={handleEmailVerified}
            onBack={handleBackToLanding}
          />
        );
      case 'otp-verification':
        return (
          <RestaurantOTPScreen 
            email={restaurantData?.email || ''}
            onVerificationSuccess={handleOTPVerified}
            onBack={() => setCurrentScreen('onboarding')}
            onResendEmail={() => setCurrentScreen('onboarding')}
          />
        );
      case 'menu-upload':
        return (
          <MenuUploadScreen 
            onMenuUploaded={handleMenuUploaded}
            onBack={() => setCurrentScreen('otp-verification')}
            onSkip={() => setCurrentScreen('table-qr')}
          />
        );
      case 'table-qr':
        return (
          <TableQRScreen 
            restaurantId="rest_123" // In real app, use actual restaurant ID
            restaurantName={restaurantData?.name || 'Your Restaurant'}
            onComplete={handleTableQRComplete}
            onBack={() => setCurrentScreen('menu-upload')}
          />
        );
      case 'dashboard':
        return (
          <RestaurantDashboard 
            restaurantData={restaurantData}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <RestaurantOnboardingScreen 
            onEmailVerified={handleEmailVerified}
            onBack={handleBackToLanding}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {renderScreen()}
    </div>
  );
}
