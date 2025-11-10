import { NextResponse } from 'next/server';
import { verifySession, cookies } from './lib/adminAuth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Enforce HTTPS for admin routes in production (allow http on localhost)
  const isAdminPath = pathname.startsWith('/admin');
  const isLocalhost = req.headers.get('host')?.startsWith('localhost') || req.headers.get('host')?.startsWith('127.0.0.1');
  const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol?.replace(':', '');
  if (isAdminPath && !isLocalhost && proto !== 'https') {
    const secureUrl = req.nextUrl.clone();
    secureUrl.protocol = 'https:';
    return NextResponse.redirect(secureUrl);
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(cookies.SESSION_COOKIE)?.value;
    const payload = token ? await verifySession(token) : null;
    if (!payload || (payload.role !== 'admin' && payload.role !== 'superadmin')) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
