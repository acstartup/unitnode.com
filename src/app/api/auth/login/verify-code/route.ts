import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/auth-utils';
import { findUserByEmail } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, email } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Verification code is required' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify the code
    const verificationResult = verifyCode(code);
    
    if (!verificationResult.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // If the code is valid, get the user data
    const user = await findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // In a real application, you would create a session here
    // For now, we'll just return success and the user data
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyName: user.companyName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error verifying login code:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}