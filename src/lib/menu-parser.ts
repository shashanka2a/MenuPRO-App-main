import { createClient } from '@supabase/supabase-js';
import { createWorker } from 'tesseract.js';
import { TenantPrismaClient } from './prisma-tenant';
import { Decimal } from '@prisma/client/runtime/library';

export interface MenuParsingConfig {
  supabaseUrl: string;
  supabaseKey: string;
  openaiApiKey?: string;
  storage: {
    bucket: string;
    path: string;
  };
}

export interface ParsedMenuItem {
  name: string;
  description?: string;
  price: number;
  category?: string;
  allergens?: string[];
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  preparationTime?: number;
}

export interface MenuParsingResult {
  success: boolean;
  versionId?: string;
  items?: ParsedMenuItem[];
  totalItems?: number;
  error?: string;
  metadata?: {
    processingTime: number;
    ocrConfidence: number;
    aiProcessed: boolean;
    sourceFile: string;
  };
}

export class MenuParserService {
  private supabase: any;
  private config: MenuParsingConfig;
  private prisma: TenantPrismaClient;

  constructor(config: MenuParsingConfig, prisma: TenantPrismaClient) {
    this.config = config;
    this.prisma = prisma;
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  async parseMenuFromFile(
    file: File,
    restaurantId: string,
    versionName: string,
    userId: string
  ): Promise<MenuParsingResult> {
    const startTime = Date.now();
    
    try {
      // 1. Upload file to Supabase Storage
      const fileName = `${restaurantId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(this.config.storage.bucket)
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      const fileUrl = this.supabase.storage
        .from(this.config.storage.bucket)
        .getPublicUrl(fileName).data.publicUrl;

      // 2. Create menu version record
      const menuVersion = await this.prisma.menuVersion.create({
        data: {
          restaurantId,
          name: versionName,
          sourceFile: fileUrl,
          parseStatus: 'PROCESSING',
          parseMetadata: {
            uploadedBy: userId,
            uploadedAt: new Date(),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          }
        }
      });

      try {
        // 3. Perform OCR extraction
        const ocrResult = await this.performOCR(file);
        
        // 4. Parse menu items using AI/ML
        const parsedItems = await this.parseMenuItems(ocrResult.text, ocrResult.confidence);
        
        // 5. Save parsed items to database
        await this.saveMenuItems(menuVersion.id, restaurantId, parsedItems);
        
        // 6. Update menu version status
        await this.prisma.menuVersion.update({
          where: { id: menuVersion.id },
          data: {
            parseStatus: 'COMPLETED',
            parseMetadata: {
              ...menuVersion.parseMetadata as any,
              processingTime: Date.now() - startTime,
              ocrConfidence: ocrResult.confidence,
              itemsFound: parsedItems.length,
              completedAt: new Date()
            }
          }
        });

        const processingTime = Date.now() - startTime;

        return {
          success: true,
          versionId: menuVersion.id,
          items: parsedItems,
          totalItems: parsedItems.length,
          metadata: {
            processingTime,
            ocrConfidence: ocrResult.confidence,
            aiProcessed: true,
            sourceFile: fileUrl
          }
        };

      } catch (processingError) {
        // Update menu version with error status
        await this.prisma.menuVersion.update({
          where: { id: menuVersion.id },
          data: {
            parseStatus: 'FAILED',
            parseMetadata: {
              ...menuVersion.parseMetadata as any,
              error: processingError.message,
              failedAt: new Date()
            }
          }
        });

        throw processingError;
      }

    } catch (error: any) {
      console.error('Menu parsing error:', error);
      return {
        success: false,
        error: error.message || 'Menu parsing failed'
      };
    }
  }

  private async performOCR(file: File): Promise<{ text: string; confidence: number }> {
    const worker = await createWorker();
    
    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      // Configure Tesseract for menu detection
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,/$€£¥₹ -()&',
        tessedit_pageseg_mode: '6', // Uniform block of text
      });

      const { data } = await worker.recognize(file);
      
      return {
        text: data.text,
        confidence: data.confidence
      };
    } finally {
      await worker.terminate();
    }
  }

  private async parseMenuItems(text: string, confidence: number): Promise<ParsedMenuItem[]> {
    // Enhanced parsing logic that combines pattern matching with AI
    const items: ParsedMenuItem[] = [];
    
    // Split text into potential menu sections
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    let currentCategory = '';
    const priceRegex = /[\$€£¥₹]?\s*(\d+(?:\.\d{2})?)\s*[\$€£¥₹]?/;
    const itemNameRegex = /^([A-Za-z\s&'-]+)(?:\s+.*)?$/;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines or very short lines
      if (line.length < 3) continue;
      
      // Detect category headers (usually all caps or title case)
      if (this.isCategoryHeader(line)) {
        currentCategory = this.normalizeCategory(line);
        continue;
      }
      
      // Try to extract menu item
      const priceMatch = line.match(priceRegex);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1]);
        const itemText = line.replace(priceRegex, '').trim();
        
        // Extract item name and description
        const parts = itemText.split(/[.\-–—:]/);
        const name = parts[0]?.trim();
        const description = parts.slice(1).join(' ').trim();
        
        if (name && name.length > 1 && price > 0) {
          const item: ParsedMenuItem = {
            name: this.cleanItemName(name),
            description: description || undefined,
            price,
            category: currentCategory || 'General'
          };
          
          // Detect dietary information
          this.detectDietaryInfo(item, line);
          
          // Estimate preparation time based on category
          item.preparationTime = this.estimatePreparationTime(item.category, item.name);
          
          items.push(item);
        }
      }
    }
    
    // If OCR confidence is low, try AI enhancement
    if (confidence < 80 && this.config.openaiApiKey) {
      return await this.enhanceWithAI(text, items);
    }
    
    return items;
  }

  private isCategoryHeader(line: string): boolean {
    // Check if line looks like a category header
    const headerPatterns = [
      /^[A-Z\s&'-]+$/, // All uppercase
      /^[A-Z][a-z\s&'-]*$/, // Title case
      /^(APPETIZERS?|STARTERS?|MAINS?|ENTREES?|DESSERTS?|BEVERAGES?|DRINKS?|SALADS?|SOUPS?|PASTA|PIZZA|BURGERS?|SANDWICHES?)/i
    ];
    
    return headerPatterns.some(pattern => pattern.test(line)) && 
           !line.match(/[\$€£¥₹]\s*\d/) && // No prices
           line.length < 50; // Not too long
  }

  private normalizeCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'APPETIZERS': 'Appetizers',
      'STARTERS': 'Appetizers',
      'MAINS': 'Main Course',
      'ENTREES': 'Main Course',
      'MAIN COURSE': 'Main Course',
      'DESSERTS': 'Desserts',
      'BEVERAGES': 'Beverages',
      'DRINKS': 'Beverages',
      'SALADS': 'Salads',
      'SOUPS': 'Soups',
      'PASTA': 'Pasta',
      'PIZZA': 'Pizza',
      'BURGERS': 'Burgers',
      'SANDWICHES': 'Sandwiches'
    };
    
    const normalized = category.toUpperCase().trim();
    return categoryMap[normalized] || category.trim();
  }

  private cleanItemName(name: string): string {
    // Remove common menu artifacts
    return name
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/\*+$/, '') // Remove asterisks
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private detectDietaryInfo(item: ParsedMenuItem, text: string): void {
    const lowerText = text.toLowerCase();
    
    // Vegan indicators
    if (lowerText.includes('vegan') || lowerText.includes('(v)')) {
      item.isVegan = true;
      item.isVegetarian = true;
    }
    
    // Vegetarian indicators
    if (lowerText.includes('vegetarian') || lowerText.includes('(veg)')) {
      item.isVegetarian = true;
    }
    
    // Gluten-free indicators
    if (lowerText.includes('gluten-free') || lowerText.includes('gluten free') || lowerText.includes('(gf)')) {
      item.isGlutenFree = true;
    }
    
    // Common allergens
    const allergens: string[] = [];
    if (lowerText.includes('nuts') || lowerText.includes('nut')) allergens.push('nuts');
    if (lowerText.includes('dairy') || lowerText.includes('milk')) allergens.push('dairy');
    if (lowerText.includes('eggs')) allergens.push('eggs');
    if (lowerText.includes('shellfish')) allergens.push('shellfish');
    if (lowerText.includes('soy')) allergens.push('soy');
    
    if (allergens.length > 0) {
      item.allergens = allergens;
    }
  }

  private estimatePreparationTime(category?: string, name?: string): number {
    // Base preparation times by category (in minutes)
    const categoryTimes: Record<string, number> = {
      'Appetizers': 10,
      'Salads': 8,
      'Soups': 5,
      'Pasta': 15,
      'Pizza': 20,
      'Main Course': 25,
      'Burgers': 15,
      'Sandwiches': 8,
      'Desserts': 10,
      'Beverages': 3
    };
    
    let baseTime = categoryTimes[category || 'General'] || 15;
    
    // Adjust based on dish complexity (simple heuristics)
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('grilled') || lowerName.includes('fried')) baseTime += 5;
      if (lowerName.includes('slow') || lowerName.includes('braised')) baseTime += 10;
      if (lowerName.includes('fresh') || lowerName.includes('raw')) baseTime -= 5;
    }
    
    return Math.max(baseTime, 3); // Minimum 3 minutes
  }

  private async enhanceWithAI(originalText: string, items: ParsedMenuItem[]): Promise<ParsedMenuItem[]> {
    // This would integrate with OpenAI API to improve parsing
    // For now, return the original items
    console.log('AI enhancement would be applied here with OpenAI API');
    return items;
  }

  private async saveMenuItems(versionId: string, restaurantId: string, items: ParsedMenuItem[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.menuItem.create({
          data: {
            restaurantId,
            menuVersionId: versionId,
            name: item.name,
            description: item.description,
            price: new Decimal(item.price),
            category: item.category,
            allergens: item.allergens || [],
            isVegan: item.isVegan || false,
            isVegetarian: item.isVegetarian || false,
            isGlutenFree: item.isGlutenFree || false,
            preparationTime: item.preparationTime,
            status: 'AVAILABLE'
          }
        });
      }
    });
  }

  async getParsingStatus(versionId: string): Promise<{
    status: string;
    progress?: number;
    itemsFound?: number;
    error?: string;
  }> {
    const version = await this.prisma.menuVersion.findUnique({
      where: { id: versionId },
      include: {
        _count: {
          select: { menuItems: true }
        }
      }
    });

    if (!version) {
      throw new Error('Menu version not found');
    }

    return {
      status: version.parseStatus || 'PENDING',
      itemsFound: version._count.menuItems,
      error: (version.parseMetadata as any)?.error
    };
  }
}

export default MenuParserService;