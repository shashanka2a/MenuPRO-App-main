import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const method = formData.get('method') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    let extractedText = '';
    let items: any[] = [];

    if (method === 'pdf') {
      // Parse PDF
      const buffer = await file.arrayBuffer();
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(Buffer.from(buffer));
      extractedText = pdfData.text;
    } else if (method === 'physical') {
      // OCR for images
      const worker = await createWorker('eng');
      
      const buffer = await file.arrayBuffer();
      const { data: { text } } = await worker.recognize(Buffer.from(buffer));
      extractedText = text;
      
      await worker.terminate();
    }

    // Parse menu items from extracted text
    items = parseMenuItems(extractedText);

    return NextResponse.json({
      success: true,
      items,
      extractedText: extractedText.substring(0, 500) + '...' // Truncate for response
    });

  } catch (error) {
    console.error('Menu parsing error:', error);
    return NextResponse.json(
      { message: 'Failed to parse menu' },
      { status: 500 }
    );
  }
}

function parseMenuItems(text: string) {
  const items: any[] = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Common price patterns
  const pricePatterns = [
    /\$(\d+\.?\d*)/g,
    /(\d+\.?\d*)\s*dollars?/gi,
    /(\d+\.?\d*)\s*USD/gi
  ];

  // Common food categories
  const categories = [
    'appetizers', 'starters', 'soups', 'salads',
    'mains', 'entrees', 'pasta', 'pizza', 'burgers',
    'desserts', 'beverages', 'drinks', 'wine', 'beer'
  ];

  let currentCategory = 'Main Course';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line is a category
    const categoryMatch = categories.find(cat => 
      line.toLowerCase().includes(cat.toLowerCase())
    );
    
    if (categoryMatch) {
      currentCategory = line;
      continue;
    }
    
    // Look for price in the line
    let price = 0;
    let priceMatch = null;
    
    for (const pattern of pricePatterns) {
      priceMatch = pattern.exec(line);
      if (priceMatch) {
        price = parseFloat(priceMatch[1]);
        break;
      }
    }
    
    if (price > 0) {
      // Extract item name (everything before the price)
      const priceIndex = line.search(/\$?\d+\.?\d*/);
      const itemName = priceIndex > 0 ? line.substring(0, priceIndex).trim() : line;
      
      // Skip if item name is too short or contains only numbers
      if (itemName.length < 3 || /^\d+$/.test(itemName)) {
        continue;
      }
      
      // Look for description in next line
      let description = '';
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        // If next line doesn't contain a price, it might be a description
        if (!nextLine.match(/\$?\d+\.?\d*/) && nextLine.length > 0 && nextLine.length < 100) {
          description = nextLine;
        }
      }
      
      // Calculate confidence based on various factors
      let confidence = 0.5; // Base confidence
      
      if (itemName.length > 5) confidence += 0.1;
      if (price > 5 && price < 100) confidence += 0.2;
      if (description.length > 0) confidence += 0.1;
      if (itemName.toLowerCase().includes('pizza') || 
          itemName.toLowerCase().includes('pasta') ||
          itemName.toLowerCase().includes('salad') ||
          itemName.toLowerCase().includes('burger')) {
        confidence += 0.2;
      }
      
      confidence = Math.min(confidence, 0.95); // Cap at 95%
      
      items.push({
        name: itemName,
        price: price,
        description: description,
        category: currentCategory,
        confidence: confidence
      });
    }
  }
  
  // Remove duplicates and sort by confidence
  const uniqueItems = items.filter((item, index, self) => 
    index === self.findIndex(t => t.name.toLowerCase() === item.name.toLowerCase())
  );
  
  return uniqueItems.sort((a, b) => b.confidence - a.confidence);
}
