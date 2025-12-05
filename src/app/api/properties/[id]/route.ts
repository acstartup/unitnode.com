import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id:string } }
)   {
    try {
        const session = await getSession();
        
    if (!session) {
        return NextResponse.json(
            { success: false, message: 'Unauthroized' },
            { status: 401 }
        )
    }

    const body = await request.json();
    const { ownerName, ownerEmail, ownerPhone, mainTenant, mainTenantPhone, rent, occupied } = body;

    // Verify the property belonds to the user
    const existingProperty = await prisma.property.findFirst({
        where: {
            id: params.id,
            userId: session.userId,
        },
    })

    if (!existingProperty) {
        return NextResponse.json(
            { success: false, message: 'Property not found' },
            { status: 404 }
        )
    }

    const property = await prisma.property.update({
        where: { id: params.id },
        data: { 
            ownerName,
            ownerEmail,
            ownerPhone,
            ...(mainTenant && { mainTenant }),
            ...(mainTenantPhone !== undefined && { mainTenantPhone }),
            ...(rent !== undefined && { rent }),
            ...(occupied !== undefined && { occupied }),
        }
    })

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
        { success: false, message: 'Failed to update property' },
        { status: 500 }
    )
  } 
}