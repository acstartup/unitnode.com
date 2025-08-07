import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, companyName, password } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send verification email with 6-digit code
    const verificationCode = await sendVerificationEmail(
      email,
      name,
      companyName
    );

    if (!verificationCode) {
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    // In a real application, you would create a user record in your database
    // with isActive: false and emailVerified: null
    
    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}