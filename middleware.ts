// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  console.log('[Middleware] Checking token for path:', pathname);
  console.log('[Middleware] Token found:', token);

  // If the user is trying to access any path under /admin
  if (pathname.startsWith('/admin')) {
    // If they have NO token, or their token does NOT have the ADMIN role,
    // redirect them to the homepage with an access denied error.
    if (!token || token.role !== 'ADMIN') {
      console.log('[Middleware] Access DENIED. Redirecting to homepage.');
      const url = new URL('/', req.url); // Create a URL object for the homepage
      url.searchParams.set('error', 'access-denied');
      return NextResponse.redirect(url);
    }
    console.log('[Middleware] Access GRANTED for admin route.');
  }

  // If the conditions are met, or the route is not an admin route, continue.
  return NextResponse.next();
}

// Configuration to specify which paths this middleware should run on.
export const config = {
  matcher: ['/admin/:path*'], // This protects all routes under the /admin path
};