import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CheckCircle, RefreshCw, ArrowLeft } from "lucide-react";

interface PaymentSuccessScreenProps {
  onNewOrder: () => void;
  onBackToLanding: () => void;
}

export function PaymentSuccessScreen({ onNewOrder, onBackToLanding }: PaymentSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been confirmed</p>
        </div>

        {/* Order Details */}
        <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Number</span>
                <span className="font-semibold text-gray-900">#MP2025001</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Table</span>
                <span className="font-semibold text-gray-900">Table 7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Time</span>
                <span className="font-semibold text-orange-600">15-20 minutes</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h3>
                  <p className="text-sm text-gray-600">
                    Your order is being prepared by our kitchen team. We&apos;ll bring it directly to your table when ready.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onNewOrder}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl flex items-center justify-center"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Order More Items
          </Button>
          
          <Button 
            onClick={onBackToLanding}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-xl flex items-center justify-center"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Landing
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Thank you for choosing MenuPRO! 
            <br />
            Rate your experience in our app.
          </p>
        </div>
      </div>
    </div>
  );
}