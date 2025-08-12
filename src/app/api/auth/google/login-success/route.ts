import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  // For demo: store a simple user object in localStorage via client redirect target
  // Since this is a server route, we just redirect to a client page that sets the user.
  const redirect = new URL('/app/dashboard', url.origin);
  // Append a flag to let the client set a basic session in localStorage if desired.
  // In this codebase, dashboard checks localStorage directly; we will set it on the client before navigation elsewhere.
  return NextResponse.redirect(redirect);
}


