'use client'

import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { 
  QrCode, 
  Download, 
  Printer, 
  ArrowLeft, 
  CheckCircle, 
  Copy,
  Eye,
  RefreshCw,
  Table,
  Smartphone
} from "lucide-react";
import QRCode from 'qrcode';

interface TableQR {
  id: string;
  tableNumber: string;
  qrCode: string;
  url: string;
  isActive: boolean;
}

interface TableQRScreenProps {
  restaurantId: string;
  restaurantName: string;
  onComplete: () => void;
  onBack: () => void;
}

export function TableQRScreen({ restaurantId, restaurantName, onComplete, onBack }: TableQRScreenProps) {
  const [numberOfTables, setNumberOfTables] = useState(10);
  const [tables, setTables] = useState<TableQR[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const generateTables = useCallback(async () => {
    setIsGenerating(true);
    const newTables: TableQR[] = [];

    const generateQRCode = async (tableNumber: string): Promise<string> => {
      try {
        const response = await fetch('/api/restaurant/generate-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId,
            tableNumber
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.qrCode;
        } else {
          throw new Error('Failed to generate QR code');
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
      }
    };

    for (let i = 1; i <= numberOfTables; i++) {
      const tableNumber = i.toString();
      const qrCode = await generateQRCode(tableNumber);
      const url = `${window.location.origin}/order?restaurant=${restaurantId}&table=${tableNumber}`;
      
      newTables.push({
        id: `table-${i}`,
        tableNumber,
        qrCode,
        url,
        isActive: true
      });
    }

    setTables(newTables);
    setIsGenerating(false);
  }, [numberOfTables, restaurantId]);

  const toggleTableSelection = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const selectAllTables = () => {
    setSelectedTables(tables.map(table => table.id));
  };

  const deselectAllTables = () => {
    setSelectedTables([]);
  };

  const downloadQRCode = (table: TableQR) => {
    const link = document.createElement('a');
    link.download = `MenuPRO-Table-${table.tableNumber}-QR.png`;
    link.href = table.qrCode;
    link.click();
  };

  const downloadAllSelected = () => {
    selectedTables.forEach(tableId => {
      const table = tables.find(t => t.id === tableId);
      if (table) {
        setTimeout(() => downloadQRCode(table), 100);
      }
    });
  };

  const printQRCode = (table: TableQR) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>MenuPRO QR Code - Table ${table.tableNumber}</title>
            <link rel="stylesheet" href="/styles/print.css">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 0;
                margin: 0;
                background: white;
              }
              .qr-print-page {
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                page-break-after: always;
              }
              .qr-container {
                border: 3px solid #ea580c;
                border-radius: 15px;
                padding: 30px;
                margin: 20px;
                max-width: 400px;
                background: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                color: #ea580c;
                margin-bottom: 15px;
              }
              .table-info {
                background: #f97316;
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
                font-weight: bold;
                font-size: 18px;
              }
              .qr-code {
                margin: 20px 0;
              }
              .qr-code img {
                max-width: 250px;
                height: auto;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
              }
              .instructions {
                background: #fef3c7;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: left;
                border-left: 4px solid #f59e0b;
              }
              .instructions h3 {
                margin: 0 0 10px 0;
                color: #92400e;
                font-size: 16px;
              }
              .instructions ol {
                margin: 0;
                padding-left: 20px;
              }
              .instructions li {
                margin: 5px 0;
                color: #92400e;
                font-size: 14px;
              }
              .restaurant-name {
                font-size: 14px;
                color: #6b7280;
                margin-top: 10px;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .qr-print-page { page-break-after: always; }
                .qr-print-page:last-child { page-break-after: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="qr-print-page">
              <div class="logo">MenuPRO</div>
              <div class="qr-container">
                <div class="table-info">Table ${table.tableNumber}</div>
                <div class="qr-code">
                  <img src="${table.qrCode}" alt="QR Code for Table ${table.tableNumber}" />
                </div>
                <div class="instructions">
                  <h3>Instructions:</h3>
                  <ol>
                    <li>Print this QR code</li>
                    <li>Place it on Table ${table.tableNumber}</li>
                    <li>Customers scan to order</li>
                  </ol>
                </div>
                <div class="restaurant-name">${restaurantName}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const copyURL = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    if (numberOfTables > 0) {
      generateTables();
    }
  }, [numberOfTables, restaurantId, generateTables]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/menupro-logo.png"
              alt="MenuPRO Logo"
              width={60}
              height={60}
              className="w-15 h-15"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Table QR Codes</h1>
          <p className="text-gray-600">Generate QR codes for each table at {restaurantName}</p>
        </div>

        {/* Table Count Input */}
        <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Number of Tables</h3>
                <p className="text-gray-600">How many tables do you have in your restaurant?</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setNumberOfTables(Math.max(1, numberOfTables - 1))}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={numberOfTables}
                  onChange={(e) => setNumberOfTables(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center font-semibold"
                  min="1"
                  max="100"
                />
                <Button
                  onClick={() => setNumberOfTables(numberOfTables + 1)}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10"
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Grid */}
        {tables.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Generated QR Codes ({tables.length} tables)
              </h3>
              <div className="flex space-x-2">
                <Button
                  onClick={selectAllTables}
                  variant="outline"
                  size="sm"
                >
                  Select All
                </Button>
                <Button
                  onClick={deselectAllTables}
                  variant="outline"
                  size="sm"
                >
                  Deselect All
                </Button>
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Hide' : 'Preview'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tables.map((table) => (
                <Card key={table.id} className={`border-none shadow-lg transition-all ${
                  selectedTables.includes(table.id) ? 'ring-2 ring-orange-500' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Table className="w-5 h-5 mr-2 text-orange-600" />
                        Table {table.tableNumber}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showPreview && (
                      <div className="text-center">
                        <Image 
                          src={table.qrCode} 
                          alt={`QR Code for Table ${table.tableNumber}`}
                          width={128}
                          height={128}
                          className="w-32 h-32 mx-auto border border-gray-200 rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Button
                        onClick={() => toggleTableSelection(table.id)}
                        variant={selectedTables.includes(table.id) ? "default" : "outline"}
                        className="w-full"
                        size="sm"
                      >
                        {selectedTables.includes(table.id) ? 'Selected' : 'Select'}
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => downloadQRCode(table)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          onClick={() => printQRCode(table)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Printer className="w-3 h-3 mr-1" />
                          Print
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => copyURL(table.url)}
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedTables.length > 0 && (
          <Card className="mb-8 border-none shadow-lg bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-orange-900">
                    Bulk Actions ({selectedTables.length} selected)
                  </h3>
                  <p className="text-orange-700">Download or print multiple QR codes at once</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={downloadAllSelected}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button
                    onClick={() => {
                      selectedTables.forEach(tableId => {
                        const table = tables.find(t => t.id === tableId);
                        if (table) {
                          setTimeout(() => printQRCode(table), 100);
                        }
                      });
                    }}
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mb-8 border-none shadow-lg bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Next Steps
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Print QR Codes</h4>
                <p className="text-sm text-blue-700">Download and print QR codes for each table</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Place on Tables</h4>
                <p className="text-sm text-blue-700">Put QR codes on each table for customers to scan</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Start Receiving Orders</h4>
                <p className="text-sm text-blue-700">Customers scan and order directly from their phones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <Button
            onClick={onComplete}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
