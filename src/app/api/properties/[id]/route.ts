import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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
    const { ownerName, ownerEmail, ownerPhone, mainTenant, mainTenantPhone, rent, occupied, tenants } = body;

    const { id } = await params;

    // Verify the property belonds to the user
    const existingProperty = await prisma.property.findFirst({
        where: {
            id,
            userId: session.userId,
        },
    })

    if (!existingProperty) {
        return NextResponse.json(
            { success: false, message: 'Property not found' },
            { status: 404 }
        )
    }

    // Update tenants if provided
    if (tenants) {
        // Delete existing tenants
        await prisma.tenant.deleteMany({
            where: { propertyId: id },
        });

        // Create new tenants
        if (tenants.length > 0) {
            await prisma.tenant.createMany({
                data: tenants.map((tenant: { name: string; phone: string; relation: string }) => ({
                    name: tenant.name,
                    phone: tenant.phone,
                    relation: tenant.relation,
                    propertyId: id,
                })),
            });
        }
    }

    const property = await prisma.property.update({
        where: { id },
        data: {
            ownerName,
            ownerEmail,
            ownerPhone,
            ...(mainTenant && { mainTenant }),
            ...(mainTenantPhone !== undefined && { mainTenantPhone }),
            ...(rent !== undefined && { rent }),
            ...(occupied !== undefined && { occupied }),
        },
        include: { tenants: true },
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