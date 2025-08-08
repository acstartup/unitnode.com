import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailVerificationToken } from '@/lib/auth-utils';
import { findUserByEmail, verifyUserEmail } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const payload = verifyEmailVerificationToken(token);
    
    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await findUserByEmail(payload.email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.emailVerified) {
      return NextResponse.json(
        { success: true, message: 'Email already verified' }
      );
    }

    // Mark the user's email as verified and activate their account
    await verifyUserEmail(payload.email);
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      email: payload.email
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}