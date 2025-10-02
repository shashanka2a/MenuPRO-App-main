import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP data
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return NextResponse.json(
        { message: 'No verification code found for this email' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return NextResponse.json(
        { message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // OTP is valid, create JWT token
    const token = jwt.sign(
      { 
        email, 
        verified: true,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { 
        expiresIn: '24h' // Token expires in 24 hours
      }
    );

    // Clean up the OTP
    otpStore.delete(email);

    return NextResponse.json(
      { 
        message: 'Email verified successfully',
        token,
        user: { email, verified: true }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
