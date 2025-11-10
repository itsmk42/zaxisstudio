import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { signSession, cookies } from '../../../../lib/adminAuth';

export async function POST(req) {
  const body = await req.json();
  const { username, password, csrf } = body || {};
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${cookies.CSRF_COOKIE}=([^;]+)`));
  const csrfCookie = match ? match[1] : '';
  if (!csrf || !csrfCookie || csrf !== csrfCookie) {
    return new NextResponse('CSRF validation failed', { status: 403 });
  }
  if (!username || !password) {
    return new NextResponse('Missing credentials', { status: 400 });
  }
  try {
    const { data: user, error } = await supabaseServer().from('admin_users').select('*').eq('username', username).single();
    if (error || !user) return new NextResponse('Unauthorized', { status: 401 });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return new NextResponse('Unauthorized', { status: 401 });
    const token = signSession({ sub: user.id, role: user.role || 'admin', username: user.username });
    const res = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === 'production';
    res.cookies.set(cookies.SESSION_COOKIE, token, { httpOnly: true, sameSite: 'Strict', secure, path: '/', maxAge: 60 * 60 * 8 });
    // Clear used CSRF token
    res.cookies.set(cookies.CSRF_COOKIE, '', { httpOnly: true, sameSite: 'Strict', secure, path: '/', maxAge: 0 });
    return res;
  } catch (e) {
    return new NextResponse('Server error', { status: 500 });
  }
}
