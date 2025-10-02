import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';
import { TenantPrismaClient } from './prisma-tenant';

export interface QRCodeConfig {
  supabaseUrl: string;
  supabaseKey: string;
  baseUrl: string; // Base URL for the app
  storage: {
    bucket: string;
    path: string;
  };
}

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'png' | 'svg';
  includeMargin?: boolean;
}

export interface TableQRCode {
  tableId: string;
  qrCode: string;
  qrCodeUrl: string;
  menuUrl: string;
  downloadUrl: string;
}

export interface GenerateQRResponse {
  success: boolean;
  qrCodes?: TableQRCode[];
  error?: string;
}

export class QRCodeService {
  private supabase: any;
  private config: QRCodeConfig;
  private prisma: TenantPrismaClient;

  constructor(config: QRCodeConfig, prisma: TenantPrismaClient) {
    this.config = config;
    this.prisma = prisma;
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  // Generate QR codes for all tables in a restaurant
  async generateRestaurantQRCodes(
    restaurantId: string,
    options: QRCodeOptions = {}
  ): Promise<GenerateQRResponse> {
    try {
      // Get all active tables for the restaurant
      const tables = await this.prisma.table.findMany({
        where: {
          restaurantId,
          isActive: true
        },
        include: {
          restaurant: {
            select: {
              slug: true,
              name: true
            }
          }
        }
      });

      if (tables.length === 0) {
        return {
          success: false,
          error: 'No active tables found for this restaurant'
        };
      }

      const qrCodes: TableQRCode[] = [];

      // Generate QR code for each table
      for (const table of tables) {
        const qrCode = await this.generateTableQRCode(table, options);
        qrCodes.push(qrCode);
      }

      return {
        success: true,
        qrCodes
      };

    } catch (error: any) {
      console.error('QR code generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate QR codes'
      };
    }
  }

  // Generate QR code for a specific table
  async generateTableQRCode(
    table: any,
    options: QRCodeOptions = {}
  ): Promise<TableQRCode> {
    const qrCodeId = this.generateQRCodeId(table.restaurantId, table.id);
    const menuUrl = this.generateMenuUrl(table.restaurant.slug, table.id, qrCodeId);
    
    // Generate QR code image
    const qrCodeBuffer = await this.createQRCodeImage(menuUrl, options);
    
    // Upload to Supabase Storage
    const fileName = `${table.restaurantId}/tables/${table.id}-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from(this.config.storage.bucket)
      .upload(fileName, qrCodeBuffer, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) {
      throw new Error(`QR code upload failed: ${uploadError.message}`);
    }

    const qrCodeUrl = this.supabase.storage
      .from(this.config.storage.bucket)
      .getPublicUrl(fileName).data.publicUrl;

    // Update table record with QR code info
    await this.prisma.table.update({
      where: { id: table.id },
      data: {
        qrCode: qrCodeId,
        qrCodeUrl: qrCodeUrl
      }
    });

    return {
      tableId: table.id,
      qrCode: qrCodeId,
      qrCodeUrl: qrCodeUrl,
      menuUrl: menuUrl,
      downloadUrl: qrCodeUrl
    };
  }

  // Generate QR code for a single table by ID
  async generateSingleTableQR(
    tableId: string,
    restaurantId: string,
    options: QRCodeOptions = {}
  ): Promise<TableQRCode> {
    const table = await this.prisma.table.findFirst({
      where: {
        id: tableId,
        restaurantId,
        isActive: true
      },
      include: {
        restaurant: {
          select: {
            slug: true,
            name: true
          }
        }
      }
    });

    if (!table) {
      throw new Error('Table not found or not active');
    }

    return await this.generateTableQRCode(table, options);
  }

  // Regenerate QR codes for tables (useful when URLs change)
  async regenerateQRCodes(
    restaurantId: string,
    tableIds?: string[],
    options: QRCodeOptions = {}
  ): Promise<GenerateQRResponse> {
    try {
      const whereClause: any = {
        restaurantId,
        isActive: true
      };

      if (tableIds && tableIds.length > 0) {
        whereClause.id = { in: tableIds };
      }

      const tables = await this.prisma.table.findMany({
        where: whereClause,
        include: {
          restaurant: {
            select: {
              slug: true,
              name: true
            }
          }
        }
      });

      const qrCodes: TableQRCode[] = [];

      for (const table of tables) {
        // Delete old QR code from storage if exists
        if (table.qrCodeUrl) {
          await this.deleteOldQRCode(table.qrCodeUrl);
        }

        const qrCode = await this.generateTableQRCode(table, options);
        qrCodes.push(qrCode);
      }

      return {
        success: true,
        qrCodes
      };

    } catch (error: any) {
      console.error('QR code regeneration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to regenerate QR codes'
      };
    }
  }

  // Generate batch download of QR codes as ZIP
  async generateQRCodeZip(
    restaurantId: string,
    tableIds?: string[]
  ): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    try {
      // This would require a ZIP library like JSZip
      // For now, return a placeholder response
      return {
        success: false,
        error: 'ZIP generation not implemented yet'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to generate ZIP file'
      };
    }
  }

  // Validate QR code and return table info
  async validateQRCode(qrCodeId: string): Promise<{
    valid: boolean;
    table?: {
      id: string;
      number: string;
      name?: string;
      restaurant: {
        id: string;
        slug: string;
        name: string;
      };
    };
    error?: string;
  }> {
    try {
      const table = await this.prisma.table.findFirst({
        where: {
          qrCode: qrCodeId,
          isActive: true
        },
        include: {
          restaurant: {
            select: {
              id: true,
              slug: true,
              name: true,
              isActive: true
            }
          }
        }
      });

      if (!table || !table.restaurant.isActive) {
        return {
          valid: false,
          error: 'Invalid or inactive QR code'
        };
      }

      return {
        valid: true,
        table: {
          id: table.id,
          number: table.number,
          name: table.name || undefined,
          restaurant: {
            id: table.restaurant.id,
            slug: table.restaurant.slug,
            name: table.restaurant.name
          }
        }
      };

    } catch (error: any) {
      return {
        valid: false,
        error: error.message || 'QR code validation failed'
      };
    }
  }

  // Private helper methods
  private generateQRCodeId(restaurantId: string, tableId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `qr_${restaurantId}_${tableId}_${timestamp}_${random}`;
  }

  private generateMenuUrl(restaurantSlug: string, tableId: string, qrCodeId: string): string {
    return `${this.config.baseUrl}/menu/${restaurantSlug}?table=${tableId}&qr=${qrCodeId}`;
  }

  private async createQRCodeImage(url: string, options: QRCodeOptions): Promise<Buffer> {
    const qrOptions = {
      type: 'png' as const,
      quality: 0.92,
      margin: options.margin || 1,
      color: {
        dark: options.color?.dark || '#000000',
        light: options.color?.light || '#FFFFFF'
      },
      width: options.size || 300,
      errorCorrectionLevel: options.errorCorrectionLevel || 'M'
    };

    return await QRCode.toBuffer(url, qrOptions);
  }

  private async deleteOldQRCode(qrCodeUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = qrCodeUrl.split('/');
      const fileName = urlParts.slice(-3).join('/'); // Get last 3 parts for path
      
      await this.supabase.storage
        .from(this.config.storage.bucket)
        .remove([fileName]);
    } catch (error) {
      console.error('Error deleting old QR code:', error);
      // Don't throw error, just log it
    }
  }

  // Get QR code analytics
  async getQRCodeAnalytics(restaurantId: string, days: number = 30): Promise<{
    totalScans: number;
    uniqueScans: number;
    scansByTable: { tableId: string; tableNumber: string; scans: number }[];
    scansByDate: { date: string; scans: number }[];
  }> {
    try {
      // This would require implementing scan tracking
      // For now, return placeholder data
      return {
        totalScans: 0,
        uniqueScans: 0,
        scansByTable: [],
        scansByDate: []
      };
    } catch (error) {
      console.error('QR analytics error:', error);
      throw error;
    }
  }

  // Track QR code scan
  async trackQRCodeScan(
    qrCodeId: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      // This would log QR code scans for analytics
      // Implementation would depend on your analytics requirements
      console.log(`QR code scan tracked: ${qrCodeId}`);
    } catch (error) {
      console.error('QR scan tracking error:', error);
      // Don't throw error for tracking failures
    }
  }
}

export default QRCodeService;