import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailVerificationToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token is missing' },
      { status: 400 }
    );
  }

  const payload = verifyEmailVerificationToken(token);
  
  if (!payload) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 400 }
    );
  }

  try {
    // In a real application, you would update the user's record in your database
    // to mark their email as verified
    
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      email: payload.email
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify email' },
      { status: 500 }
    );
  }
}