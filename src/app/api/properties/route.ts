import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const properties = await prisma.property.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { address, mainTenant, rent, occupied, ownerName, ownerEmail, ownerPhone } = body;

    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address is required' },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        address,
        mainTenant: mainTenant || 'N/A',
        rent: rent || 0,
        occupied: occupied || false,
        ownerName,
        ownerEmail,
        ownerPhone,
        userId: session.userId,
      },
    });

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create property' },
      { status: 500 }
    );
  }
}