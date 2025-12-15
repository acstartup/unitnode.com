import { NextResponse } from 'next/server';
import { verifyPasswordResetToken } from '@/lib/auth-utils';
import { findUserByEmail } from '@/lib/user-service';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password requirements
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one number' },
        { status: 400 }
      );
    }

    // Verify the token
    const payload = verifyPasswordResetToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await findUserByEmail(payload.email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if new password is the same as current password
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return NextResponse.json(
        { success: false, message: 'New password must be different from your current password' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while resetting password' },
      { status: 500 }
    );
  }
}
