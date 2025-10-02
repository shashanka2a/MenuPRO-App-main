'use client'

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { QrCode, CheckCircle } from "lucide-react";

interface QRScanScreenProps {
  onScanComplete: () => void;
}

export function QRScanScreen({ onScanComplete }: QRScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate QR scan process
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        onScanComplete();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
          <p className="text-gray-600">Point your camera at the QR code on your table</p>
        </div>

        {/* QR Scanner Frame */}
        <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="relative">
              {/* QR Scanner Viewport */}
              <div className={`w-64 h-64 mx-auto rounded-2xl border-4 ${
                scanComplete ? 'border-green-500' : 'border-orange-500'
              } relative overflow-hidden bg-gray-100`}>
                {/* Corner frames */}
                <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-orange-500 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-orange-500 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-orange-500 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-orange-500 rounded-br-lg"></div>
                
                {/* Scanner content */}
                <div className="w-full h-full flex items-center justify-center">
                  {scanComplete ? (
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-green-600 font-semibold">Scan Complete!</p>
                    </div>
                  ) : isScanning ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-orange-600 font-semibold">Scanning...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Position QR code here</p>
                    </div>
                  )}
                </div>

                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 opacity-75 animate-pulse"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {!scanComplete && (
          <Button 
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-4 rounded-xl"
            size="lg"
          >
            {isScanning ? "Scanning..." : "Start Scanning"}
          </Button>
        )}

        <p className="text-sm text-gray-500 mt-6">
          Make sure the QR code is clearly visible and well-lit
        </p>
      </div>
    </div>
  );
}