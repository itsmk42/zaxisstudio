import { NextResponse } from 'next/server';
import { verifySession, cookies } from './lib/adminAuth';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(cookies.SESSION_COOKIE)?.value;
    const payload = token ? verifySession(token) : null;
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
