import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/user-service';
import { sendPasswordResetEmail } from '@/lib/email-service';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserByEmail(email);

    if (!user) {
      // For security, don't reveal if user exists or not
      // Return success even if user doesn't exist
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Send password reset email
    const token = await sendPasswordResetEmail(email, user.name || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
