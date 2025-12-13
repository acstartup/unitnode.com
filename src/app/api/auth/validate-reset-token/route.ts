import { NextResponse } from 'next/server';
import { verifyPasswordResetToken } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token
    const payload = verifyPasswordResetToken(token);

    if (!payload) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: payload.email
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
