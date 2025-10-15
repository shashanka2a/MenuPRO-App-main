'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ShoppingCart, Plus } from "lucide-react";
import Image from "next/image";
import { MenuItem, CartItem } from "../pwa-app";

interface MenuScreenProps {
  onSelectItem: (item: MenuItem) => void;
  onViewCart: () => void;
  cartItems: CartItem[];
}

const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: "app1",
    name: "Bruschetta Trio",
    description: "Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella",
    price: 14,
    image: "https://images.unsplash.com/photo-1536739782508-c2388552aad3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBldGl6ZXIlMjBicnVzY2hldHRhfGVufDF8fHx8MTc1ODMwMTY2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "appetizers"
  },
  {
    id: "app2",
    name: "Calamari Rings",
    description: "Crispy fried squid rings served with marinara sauce and lemon wedges",
    price: 16,
    image: "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NTgzMDAzNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "appetizers"
  },
  // Mains
  {
    id: "main1",
    name: "Gourmet Burger",
    description: "Beef patty with aged cheddar, caramelized onions, and truffle aioli on brioche bun",
    price: 24,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDF8fHx8MTc1ODMwMTMwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "mains",
    options: {
      size: ["Regular", "Large"],
      customizations: ["Extra Cheese", "Bacon", "Avocado", "No Onions"]
    }
  },
  {
    id: "main2",
    name: "Grilled Salmon",
    description: "Atlantic salmon with roasted vegetables and lemon herb sauce",
    price: 32,
    image: "https://images.unsplash.com/photo-1758157836016-3f3fbc5bf796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwbWVhbHxlbnwxfHx8fDE3NTg0MDMxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "mains"
  },
  // Desserts
  {
    id: "dessert1",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 12,
    image: "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc1ODM4OTIzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "desserts"
  },
  {
    id: "dessert2",
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 10,
    image: "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0fGVufDF8fHx8MTc1ODM4OTIzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "desserts"
  },
  // Beverages
  {
    id: "bev1",
    name: "Craft Cocktail",
    description: "House special with premium spirits and fresh ingredients",
    price: 14,
    image: "https://images.unsplash.com/photo-1714596428132-08574e996bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rfGVufDF8fHx8MTc1ODMyODI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "beverages"
  },
  {
    id: "bev2",
    name: "Fresh Juice",
    description: "Daily selection of fresh pressed juices",
    price: 8,
    image: "https://images.unsplash.com/photo-1714596428132-08574e996bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rfGVufDF8fHx8MTc1ODMyODI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "beverages"
  }
];

export function MenuScreen({ onSelectItem, onViewCart, cartItems }: MenuScreenProps) {
  const [activeTab, setActiveTab] = useState("appetizers");

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo-utensils.svg"
              alt="MenuPRO Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MenuPRO</h1>
              <p className="text-sm text-gray-600">Table 7 • The Garden Restaurant</p>
            </div>
          </div>
          <Button 
            onClick={onViewCart}
            className="relative bg-orange-600 hover:bg-orange-700 text-white rounded-full p-3"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Menu Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="appetizers" className="text-sm">Appetizers</TabsTrigger>
            <TabsTrigger value="mains" className="text-sm">Mains</TabsTrigger>
            <TabsTrigger value="desserts" className="text-sm">Desserts</TabsTrigger>
            <TabsTrigger value="beverages" className="text-sm">Beverages</TabsTrigger>
          </TabsList>

          <TabsContent value="appetizers">
            <MenuItemGrid items={getItemsByCategory("appetizers")} onSelectItem={onSelectItem} />
          </TabsContent>
          <TabsContent value="mains">
            <MenuItemGrid items={getItemsByCategory("mains")} onSelectItem={onSelectItem} />
          </TabsContent>
          <TabsContent value="desserts">
            <MenuItemGrid items={getItemsByCategory("desserts")} onSelectItem={onSelectItem} />
          </TabsContent>
          <TabsContent value="beverages">
            <MenuItemGrid items={getItemsByCategory("beverages")} onSelectItem={onSelectItem} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Cart Summary (if items in cart) */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button 
            onClick={onViewCart}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl flex items-center justify-between"
            size="lg"
          >
            <span>View Cart ({cartItemCount} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}

interface MenuItemGridProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

function MenuItemGrid({ items, onSelectItem }: MenuItemGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 pb-24">
      {items.map(item => (
        <Card key={item.id} className="overflow-hidden border-none shadow-sm bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover flex-shrink-0"
              />
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-orange-600">${item.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <Button 
                  onClick={() => onSelectItem(item)}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}