import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.userId;

        // Remove logo URL from database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { companyLogo: null },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                companyLogo: true,
                role: true,
            }
        });

        return NextResponse.json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error('Delete logo error:', error);
        return NextResponse.json(
            { error: 'Delete failed' },
            { status: 500 }
        );
    }
}
