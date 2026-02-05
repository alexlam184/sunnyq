import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get('callbackUrl') ?? '/';
  const signinUrl = new URL('/api/auth/signin/google', url.origin);
  signinUrl.searchParams.set('callbackUrl', callbackUrl);
  return NextResponse.redirect(signinUrl);
}
