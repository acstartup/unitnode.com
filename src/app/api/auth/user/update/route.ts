import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.userId;
        const body = await request.json();
        const { companyName, email, password } = body;

        const updates: any = {};

        if (companyName !== undefined) {
            updates.companyName = companyName;
        }

        if (email !== undefined) {
            // Check if email is already taken by another user
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing && existing.id !== userId) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }
            updates.email = email;
        }

        if (password !== undefined && password !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates,
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
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Update failed' },
            { status: 500 }
        );
    }
}
