import { NextRequest, NextResponse } from 'next/server';
import { getPrismaFromRequest } from '@/lib/prisma-tenant';
import { withAuth } from '@/lib/supabase-auth';
import { setupAuditLogging } from '@/lib/audit-middleware';
import QRCodeService from '@/lib/qr-service';

export interface GenerateQRRequest {
  tableIds?: string[]; // If provided, generate only for these tables
  regenerate?: boolean; // Whether to regenerate existing QR codes
  options?: {
    size?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  };
}

export interface GenerateQRResponse {
  success: boolean;
  qrCodes?: {
    tableId: string;
    tableNumber: string;
    qrCodeUrl: string;
    menuUrl: string;
  }[];
  downloadUrl?: string; // For batch download
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<GenerateQRResponse>> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      // Check permissions
      const hasManagerPermission = user.memberships.some(m => 
        m.restaurantId === tenantContext.restaurantId && 
        ['MANAGER', 'ADMIN', 'OWNER'].includes(m.role)
      );

      if (!hasManagerPermission) {
        return NextResponse.json({
          success: false,
          error: 'Insufficient permissions to generate QR codes'
        }, { status: 403 });
      }

      const body: GenerateQRRequest = await request.json();
      const prisma = getPrismaFromRequest(request);
      setupAuditLogging(prisma, request, tenantContext);

      // Initialize QR code service
      const qrConfig = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        storage: {
          bucket: 'qr-codes',
          path: 'tables'
        }
      };

      const qrService = new QRCodeService(qrConfig, prisma);

      let result;
      
      if (body.regenerate) {
        // Regenerate existing QR codes
        result = await qrService.regenerateQRCodes(
          tenantContext.restaurantId!,
          body.tableIds,
          body.options || {}
        );
      } else {
        // Generate new QR codes
        result = await qrService.generateRestaurantQRCodes(
          tenantContext.restaurantId!,
          body.options || {}
        );
      }

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }

      // Get table details for response
      const tableIds = result.qrCodes?.map(qr => qr.tableId) || [];
      const tables = await prisma.table.findMany({
        where: {
          id: { in: tableIds },
          restaurantId: tenantContext.restaurantId
        },
        select: {
          id: true,
          number: true,
          name: true
        }
      });

      const qrCodes = result.qrCodes?.map(qr => {
        const table = tables.find(t => t.id === qr.tableId);
        return {
          tableId: qr.tableId,
          tableNumber: table?.number || 'Unknown',
          qrCodeUrl: qr.qrCodeUrl,
          menuUrl: qr.menuUrl
        };
      }) || [];

      return NextResponse.json({
        success: true,
        qrCodes
      });

    } catch (error: any) {
      console.error('QR code generation error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to generate QR codes'
      }, { status: 500 });
    }
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const tableId = searchParams.get('tableId');
      const analytics = searchParams.get('analytics') === 'true';

      const prisma = getPrismaFromRequest(request);
      
      if (analytics) {
        // Return QR code analytics
        const qrConfig = {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
          supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
          storage: {
            bucket: 'qr-codes',
            path: 'tables'
          }
        };

        const qrService = new QRCodeService(qrConfig, prisma);
        const analyticsData = await qrService.getQRCodeAnalytics(tenantContext.restaurantId!);

        return NextResponse.json({
          success: true,
          analytics: analyticsData
        });
      }

      // Return current QR codes
      const where: any = {
        restaurantId: tenantContext.restaurantId,
        isActive: true
      };

      if (tableId) {
        where.id = tableId;
      }

      const tables = await prisma.table.findMany({
        where,
        select: {
          id: true,
          number: true,
          name: true,
          qrCode: true,
          qrCodeUrl: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { number: 'asc' }
      });

      const qrCodes = tables.map(table => ({
        tableId: table.id,
        tableNumber: table.number,
        tableName: table.name,
        qrCode: table.qrCode,
        qrCodeUrl: table.qrCodeUrl,
        hasQRCode: !!table.qrCode,
        createdAt: table.createdAt.toISOString(),
        updatedAt: table.updatedAt.toISOString()
      }));

      return NextResponse.json({
        success: true,
        qrCodes
      });

    } catch (error: any) {
      console.error('Get QR codes error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to retrieve QR codes'
      }, { status: 500 });
    }
  });
}