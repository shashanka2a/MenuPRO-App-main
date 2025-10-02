import { NextRequest, NextResponse } from 'next/server';
import { getPrismaFromRequest } from '@/lib/prisma-tenant';
import { withAuth } from '@/lib/supabase-auth';
import { setupAuditLogging } from '@/lib/audit-middleware';
import MenuParserService, { MenuParsingResult } from '@/lib/menu-parser';

export interface ParseMenuRequest {
  versionName: string;
  makeActive?: boolean;
}

export interface ParseMenuResponse {
  success: boolean;
  result?: MenuParsingResult;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<ParseMenuResponse>> {
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
          error: 'Insufficient permissions to parse menu'
        }, { status: 403 });
      }

      const formData = await request.formData();
      const file = formData.get('file') as File;
      const versionName = formData.get('versionName') as string;
      const makeActive = formData.get('makeActive') === 'true';

      if (!file) {
        return NextResponse.json({
          success: false,
          error: 'No file provided'
        }, { status: 400 });
      }

      if (!versionName) {
        return NextResponse.json({
          success: false,
          error: 'Version name is required'
        }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          success: false,
          error: 'File type not supported. Please upload PDF, JPEG, PNG, or GIF files.'
        }, { status: 400 });
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({
          success: false,
          error: 'File size too large. Maximum 10MB allowed.'
        }, { status: 400 });
      }

      const prisma = getPrismaFromRequest(request);
      setupAuditLogging(prisma, request, tenantContext);

      // Initialize menu parser
      const parserConfig = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        openaiApiKey: process.env.OPENAI_API_KEY,
        storage: {
          bucket: 'menu-uploads',
          path: 'menus'
        }
      };

      const menuParser = new MenuParserService(parserConfig, prisma);

      // Parse the menu
      const result = await menuParser.parseMenuFromFile(
        file,
        tenantContext.restaurantId!,
        versionName,
        user.id
      );

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 500 });
      }

      // If makeActive is true, set this version as active
      if (makeActive && result.versionId) {
        await prisma.$transaction(async (tx: any) => {
          // Deactivate current active version
          await tx.menuVersion.updateMany({
            where: {
              restaurantId: tenantContext.restaurantId,
              isActive: true
            },
            data: {
              isActive: false
            }
          });

          // Activate new version
          await tx.menuVersion.update({
            where: { id: result.versionId },
            data: {
              isActive: true,
              isPublished: true,
              publishedAt: new Date()
            }
          });
        });
      }

      return NextResponse.json({
        success: true,
        result
      });

    } catch (error: any) {
      console.error('Menu parsing error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to parse menu'
      }, { status: 500 });
    }
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return withAuth(req, async (request, user, tenantContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const versionId = searchParams.get('versionId');

      if (!versionId) {
        return NextResponse.json({
          success: false,
          error: 'Version ID is required'
        }, { status: 400 });
      }

      const prisma = getPrismaFromRequest(request);
      const parserConfig = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        storage: {
          bucket: 'menu-uploads',
          path: 'menus'
        }
      };

      const menuParser = new MenuParserService(parserConfig, prisma);
      const status = await menuParser.getParsingStatus(versionId);

      return NextResponse.json({
        success: true,
        status
      });

    } catch (error: any) {
      console.error('Get parsing status error:', error);
      
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to get parsing status'
      }, { status: 500 });
    }
  });
}