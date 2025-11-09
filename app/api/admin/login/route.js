import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('admin_auth', password, { httpOnly: false, sameSite: 'lax', path: '/' });
    return res;
  }
  return new NextResponse('Unauthorized', { status: 401 });
}
