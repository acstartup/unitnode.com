import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession, setSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, companyName } = body as { email?: string; companyName?: string };

    if (!email || !companyName) {
      return NextResponse.json({ success: false, message: 'Email and company name are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { companyName },
    });

    // Create session after updating company name
    const sessionToken = createSession({
      userId: updated.id,
      email: updated.email,
      role: updated.role,
    });

    const response = NextResponse.json({ success: true });
    setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    console.error('Google complete error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}


