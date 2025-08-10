import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/email-service';
import { validateCredentials } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // First validate the credentials
    const user = await validateCredentials(email, password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // If credentials are valid, send a verification code
    const verificationCode = await sendVerificationCode(
      email,
      user.name || undefined,
      user.companyName || undefined
    );

    if (!verificationCode) {
      return NextResponse.json(
        { success: false, message: 'Failed to send verification code' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}