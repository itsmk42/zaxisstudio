import { NextResponse } from 'next/server';
import { createCsrfToken, cookies } from '../../../../../lib/adminAuth';

export async function GET() {
  const token = createCsrfToken();
  const res = NextResponse.json({ token });
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set(cookies.CSRF_COOKIE, token, {
    httpOnly: true,
    sameSite: 'Strict',
    secure,
    path: '/',
    maxAge: 60 * 10 // 10 minutes
  });
  return res;
}

