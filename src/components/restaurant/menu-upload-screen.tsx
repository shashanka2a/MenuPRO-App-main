'use client'

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Trash2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

interface MenuUploadScreenProps {
  onMenuUploaded: (menuItems: MenuItem[]) => void;
  onBack: () => void;
  onSkip: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
}

interface ParsedMenuItem {
  name: string;
  price: number;
  description?: string;
  category?: string;
  confidence: number;
}

export function MenuUploadScreen({ onMenuUploaded, onBack, onSkip }: MenuUploadScreenProps) {
  const [uploadMethod, setUploadMethod] = useState<'physical' | 'pdf' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, method: 'physical' | 'pdf') => {
    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('method', method);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/restaurant/parse-menu', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const data = await response.json();
        setParsedItems(data.items || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to parse menu');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhysicalMenuUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'physical');
    }
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'pdf');
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'physical');
    }
  };

  const addParsedItem = (item: ParsedMenuItem) => {
    const newMenuItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category || 'Main Course',
      isAvailable: true
    };
    setMenuItems(prev => [...prev, newMenuItem]);
    setParsedItems(prev => prev.filter(parsedItem => parsedItem !== item));
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveMenu = () => {
    onMenuUploaded(menuItems);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/menupro-logo.png"
              alt="MenuOS Logo"
              width={60}
              height={60}
              className="w-15 h-15"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Menu</h1>
          <p className="text-gray-600">We&apos;ll help you digitize your menu automatically</p>
        </div>

        {/* Upload Method Selection */}
        {!uploadMethod && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-orange-500"
              onClick={() => setUploadMethod('physical')}
            >
              <CardContent className="p-8 text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <h3 className="text-xl font-semibold mb-2">Physical Menu Photo</h3>
                <p className="text-gray-600 mb-4">
                  Take a photo of your physical menu and we&apos;ll extract the details using AI
                </p>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  AI-Powered OCR
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-orange-500"
              onClick={() => setUploadMethod('pdf')}
            >
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <h3 className="text-xl font-semibold mb-2">PDF Menu</h3>
                <p className="text-gray-600 mb-4">
                  Upload your PDF menu and we&apos;ll parse the text to extract menu items
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Text Parsing
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Physical Menu Upload */}
        {uploadMethod === 'physical' && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ImageIcon className="w-6 h-6 mr-3 text-orange-600" />
                Upload Physical Menu
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-semibold mb-2">Upload Photo</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a clear photo of your menu
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhysicalMenuUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-semibold mb-2">Take Photo</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Use your camera to capture the menu
                    </p>
                    <Button
                      onClick={() => cameraInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      Take Photo
                    </Button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">📸 Tips for Best Results:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Ensure good lighting</li>
                    <li>• Keep the menu flat and straight</li>
                    <li>• Capture the entire menu in one photo</li>
                    <li>• Avoid shadows and glare</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Upload */}
        {uploadMethod === 'pdf' && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-orange-600" />
                Upload PDF Menu
              </h2>
              
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Upload Your PDF Menu</h3>
                <p className="text-gray-600 mb-6">
                  We&apos;ll automatically extract menu items from your PDF
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
                >
                  Choose PDF File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Processing Your Menu...</h3>
                <Progress value={uploadProgress} className="mb-4" />
                <p className="text-sm text-gray-600">
                  {uploadMethod === 'physical' 
                    ? 'Using AI to extract menu items from your photo...' 
                    : 'Parsing PDF text to extract menu items...'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-none shadow-lg bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800">Upload Failed</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parsed Items */}
        {parsedItems.length > 0 && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6">Detected Menu Items</h3>
              <div className="space-y-4">
                {parsedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{item.name}</h4>
                        <Badge className={getConfidenceColor(item.confidence)}>
                          {Math.round(item.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => addParsedItem(item)}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Add to Menu
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        {menuItems.length > 0 && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6">Your Menu Items ({menuItems.length})</h3>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} • {item.category}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setEditingItem(item)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => removeMenuItem(item.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex space-x-4">
            <Button
              onClick={onSkip}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 px-8 py-3 rounded-xl"
            >
              Skip for Now
            </Button>
            {menuItems.length > 0 && (
              <Button
                onClick={handleSaveMenu}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
              >
                Save Menu ({menuItems.length} items)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
