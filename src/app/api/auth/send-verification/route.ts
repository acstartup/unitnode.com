import { NextRequest, NextResponse } from 'next/server';
import { generateEmailVerificationToken } from '@/lib/auth-utils';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, companyName } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a verification token
    const token = generateEmailVerificationToken({ 
      email, 
      name, 
      companyName 
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      token,
      name,
      companyName
    );

    if (!emailSent) {
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