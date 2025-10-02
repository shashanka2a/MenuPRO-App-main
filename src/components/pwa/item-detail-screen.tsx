'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { MenuItem, CartItem } from "../pwa-app";

interface ItemDetailScreenProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  onBack: () => void;
  onViewCart: () => void;
}

export function ItemDetailScreen({ item, onAddToCart, onBack, onViewCart }: ItemDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(item.options?.size?.[0] || "");
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  const handleCustomizationToggle = (customization: string) => {
    setSelectedCustomizations(prev => 
      prev.includes(customization) 
        ? prev.filter(c => c !== customization)
        : [...prev, customization]
    );
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      ...item,
      quantity,
      selectedOptions: {
        size: selectedSize,
        customizations: selectedCustomizations
      }
    };
    onAddToCart(cartItem);
    onBack();
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm"
            className="rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Item Details</h1>
          <Button 
            onClick={onViewCart}
            variant="ghost" 
            size="sm"
            className="rounded-full p-2"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Item Image */}
        <Card className="mb-6 overflow-hidden border-none shadow-lg">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover"
          />
        </Card>

        {/* Item Info */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
            <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
              ${item.price}
            </Badge>
          </div>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Size Options */}
        {item.options?.size && (
          <Card className="mb-6 border-none shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {item.options.size.map(size => (
                  <Button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={selectedSize === size ? "bg-orange-600 hover:bg-orange-700" : "border-gray-300"}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customizations */}
        {item.options?.customizations && (
          <Card className="mb-6 border-none shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Customizations</h3>
              <div className="space-y-2">
                {item.options.customizations.map(customization => (
                  <Button
                    key={customization}
                    onClick={() => handleCustomizationToggle(customization)}
                    variant={selectedCustomizations.includes(customization) ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedCustomizations.includes(customization) 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "border-gray-300"
                    }`}
                  >
                    {customization}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantity Selector */}
        <Card className="mb-6 border-none shadow-sm bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold text-gray-900 w-8 text-center">{quantity}</span>
              <Button
                onClick={() => setQuantity(quantity + 1)}
                variant="outline"
                size="sm"
                className="rounded-full w-10 h-10 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl flex items-center justify-between"
          size="lg"
        >
          <span>Add to Cart</span>
          <span>${totalPrice.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  );
}