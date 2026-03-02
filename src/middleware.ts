
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authAccountId = request.cookies.get('auth_account_id')?.value;
  const authSessionId = request.cookies.get('auth_session_id')?.value;
  const authSessionKey = request.cookies.get('auth_session_key')?.value;
  
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  // Note: /signin is now only used as a fallback or information page
  const isPublicPath = pathname === '/signin' || pathname.startsWith('/bridge/callback.v1');

  if ((!authAccountId || !authSessionId || !authSessionKey) && !isPublicPath) {
    // If not signed in to Neup.Account, redirect to the main account signin start page
    const accountSignInUrl = `https://neupgroup.com/account/auth/start?redirect_to=${encodeURIComponent(`https://neupgroup.com/suite${pathname}`)}`;
    return NextResponse.redirect(accountSignInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - bridge (API/Webhook/Callback routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!bridge|_next/static|_next/image|favicon.ico).*)',
  ],
};
