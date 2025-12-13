import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/user-service';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { exists: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists with this email
    const user = await findUserByEmail(email);

    return NextResponse.json({
      exists: !!user,
    });
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { exists: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
