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
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }
  try {
    const client = supabaseServer();
    const { data: user, error } = await client.from('admin_users').select('*').eq('username', username).single();
    if (error || !user) return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });

    // Check lockout
    if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
      return NextResponse.json({ error: 'Account temporarily locked', details: { locked_until: user.locked_until } }, { status: 423 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const failedAttempts = (user.failed_attempts || 0) + 1;
      let updates = { failed_attempts: failedAttempts, last_failed_at: new Date().toISOString() };
      // Lock after 5 failed attempts
      if (failedAttempts >= 5) {
        const lockMinutes = 15;
        const until = new Date(Date.now() + lockMinutes * 60 * 1000).toISOString();
        updates = { failed_attempts: 0, locked_until: until, last_failed_at: updates.last_failed_at };
      }
      await client.from('admin_users').update(updates).eq('id', user.id);
      const isLocked = updates.locked_until ? { error: 'Too many failed attempts. Account locked', details: { locked_until: updates.locked_until } } : { error: 'Invalid username or password' };
      return NextResponse.json(isLocked, { status: updates.locked_until ? 423 : 401 });
    }

    // On success, reset counters
    await client.from('admin_users').update({ failed_attempts: 0, locked_until: null }).eq('id', user.id);
    const token = signSession({ sub: user.id, role: user.role || 'admin', username: user.username });
    const res = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === 'production';
    res.cookies.set(cookies.SESSION_COOKIE, token, { httpOnly: true, sameSite: 'Strict', secure, path: '/', maxAge: 60 * 60 * 8 });
    // Clear used CSRF token
    res.cookies.set(cookies.CSRF_COOKIE, '', { httpOnly: true, sameSite: 'Strict', secure, path: '/', maxAge: 0 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
