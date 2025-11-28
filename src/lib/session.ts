import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your session-secret-key';
const SESSION_COOKIE_NAME = 'session';

export interface SessionPayload {
    userId: string;
    email: string;
    role: string;
}

export function createSession(payload: SessionPayload): string {
    return jwt.sign(payload, SESSION_SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string): SessionPayload | null {
    try {
        return jwt.verify(token, SESSION_SECRET) as SessionPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
}

export function setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })
}