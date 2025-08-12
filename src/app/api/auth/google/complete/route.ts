import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    await prisma.user.update({
      where: { email },
      data: { companyName },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Google complete error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}


