import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${process.env.SITE_URL || url.origin}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: 'Google OAuth is not configured (missing GOOGLE_CLIENT_ID)' },
      { status: 500 }
    );
  }

  const state = url.searchParams.get('state') || 'signup';

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}

 
