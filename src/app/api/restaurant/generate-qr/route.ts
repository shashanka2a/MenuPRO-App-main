import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, tableNumber } = await request.json();

    if (!restaurantId || !tableNumber) {
      return NextResponse.json(
        { message: 'Restaurant ID and table number are required' },
        { status: 400 }
      );
    }

    // Generate the URL for the QR code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://menupro.app';
    const orderUrl = `${baseUrl}/order?restaurant=${restaurantId}&table=${tableNumber}`;

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(orderUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      url: orderUrl,
      tableNumber,
      restaurantId
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { message: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// Bulk QR generation endpoint
export async function PUT(request: NextRequest) {
  try {
    const { restaurantId, numberOfTables } = await request.json();

    if (!restaurantId || !numberOfTables) {
      return NextResponse.json(
        { message: 'Restaurant ID and number of tables are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://menupro.app';
    const qrCodes = [];

    for (let i = 1; i <= numberOfTables; i++) {
      const orderUrl = `${baseUrl}/order?restaurant=${restaurantId}&table=${i}`;
      
      try {
        const qrCodeDataURL = await QRCode.toDataURL(orderUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        qrCodes.push({
          tableNumber: i.toString(),
          qrCode: qrCodeDataURL,
          url: orderUrl
        });
      } catch (error) {
        console.error(`Error generating QR for table ${i}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      qrCodes,
      totalTables: numberOfTables
    });

  } catch (error) {
    console.error('Bulk QR generation error:', error);
    return NextResponse.json(
      { message: 'Failed to generate QR codes' },
      { status: 500 }
    );
  }
}
