import { Card, CardContent } from "./ui/card";
import { QrCode, Clock, BarChart3, Smartphone } from "lucide-react";

const services = [
  {
    id: 1,
    name: "QR Code Ordering System",
    description: "Customers scan QR codes to access your digital menu and place orders directly from their phones. No app downloads required, seamless experience.",
    icon: QrCode,
  },
  {
    id: 2,
    name: "Real-time Analytics",
    description: "Track sales, popular items, and customer behavior with detailed analytics dashboard. Make data-driven decisions for your restaurant.",
    icon: BarChart3,
  },
  {
    id: 3,
    name: "Order Management",
    description: "Streamline kitchen operations with real-time order tracking and management tools. Reduce errors and improve efficiency.",
    icon: Clock,
  },
  {
    id: 4,
    name: "Payment Processing",
    description: "Secure payment processing with multiple payment options and no transaction fees. Keep 100% of your revenue.",
    icon: Smartphone,
  }
];

export function MenuGrid() {
  return (
    <section className="py-20 px-4 bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a2e] font-sans">
            Our Core Features
          </h2>
        </div>
        
        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="bg-white rounded-lg shadow-md border-0 border-t-[2px] border-t-[#FF6B00] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  <service.icon className="w-6 h-6 text-white" fill="white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1a1a2e] font-sans">{service.name}</h3>
                <p className="text-[#1a1a2e] font-sans leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
