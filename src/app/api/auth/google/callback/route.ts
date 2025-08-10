import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    // const state = url.searchParams.get('state') || 'signup';

    if (!code) {
      return NextResponse.json({ success: false, message: 'Missing OAuth code' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.SITE_URL || url.origin}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, message: 'Google OAuth is not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)' },
        { status: 500 }
      );
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('Google token exchange failed:', text);
      return NextResponse.json({ success: false, message: 'Failed to exchange code for tokens' }, { status: 400 });
    }

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    // Get user info via id_token
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) {
      const text = await userInfoRes.text();
      console.error('Google userinfo fetch failed:', text);
      return NextResponse.json({ success: false, message: 'Failed to fetch user info' }, { status: 400 });
    }

    const userInfo = (await userInfoRes.json()) as GoogleUserInfo;

    if (!userInfo?.email) {
      return NextResponse.json({ success: false, message: 'Google did not return an email address' }, { status: 400 });
    }

    // If user exists, mark verified/active and go to completion routing
    const existingUser = await prisma.user.findUnique({ where: { email: userInfo.email } });

    if (existingUser) {
      // Ensure account is active and email verified
      const updated = await prisma.user.update({
        where: { email: userInfo.email },
        data: {
          emailVerified: existingUser.emailVerified ?? new Date(),
          isActive: true,
          name: existingUser.name ?? userInfo.name ?? userInfo.given_name ?? undefined,
        },
      });
      // If the user has a company name already, we can send them to login modal opener
      const hasCompany = Boolean(updated.companyName);
      const next = hasCompany
        ? '/?unitnode_open_login_modal=true'
        : `/?unitnode_open_signup_modal=google_complete&email=${encodeURIComponent(userInfo.email)}`;
      return NextResponse.redirect(new URL(next, url.origin));
    }

    // If no user, create a minimal record with a random hashed password to satisfy schema
    const randomPassword = randomUUID();
    const hashed = await bcrypt.hash(randomPassword, 10);
    await prisma.user.create({
      data: {
        email: userInfo.email,
        password: hashed,
        name: userInfo.name ?? userInfo.given_name ?? undefined,
        isActive: true,
        emailVerified: new Date(),
      },
    });

    // Redirect to company completion page styled like 2FA
    const next = `/?unitnode_open_signup_modal=google_complete&email=${encodeURIComponent(userInfo.email)}`;
    return NextResponse.redirect(new URL(next, url.origin));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json({ success: false, message: 'OAuth error' }, { status: 500 });
  }
}


