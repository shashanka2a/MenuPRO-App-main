import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email, { otp, expires });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'MenuPRO - Restaurant Account Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea580c; font-size: 28px; margin: 0;">MenuPRO</h1>
            <p style="color: #666; margin: 5px 0;">Restaurant Management Platform</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Restaurant Account Verification</h2>
            <div style="background: #fff; padding: 20px; border-radius: 8px; border: 2px solid #ea580c; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #ea580c; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">
              This code will expire in 10 minutes
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">Welcome to MenuPRO!</h3>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              You're about to join thousands of restaurants using MenuPRO to streamline their digital ordering. 
              This verification ensures your restaurant account is secure.
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>If you didn't request this code, please ignore this email.</p>
            <p>This is an automated message from MenuPRO Restaurant Platform.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { message: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of Array.from(otpStore.entries())) {
    if (data.expires < now) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
