import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                companyLogo: true,
                role: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}