import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
    }

    const verificationResult = verifyCode(code);
    
    if (!verificationResult.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // In a real application, you would update the user record in your database
    // to mark their email as verified and activate their account
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      email: verificationResult.email,
      companyName: verificationResult.companyName,
      name: verificationResult.name
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}