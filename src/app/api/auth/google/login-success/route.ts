import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Redirect to client page that will set localStorage and handle navigation
  const redirect = new URL('/auth/google/login-success', url.origin);
  redirect.search = url.search; // preserve user params
  return NextResponse.redirect(redirect);
}


