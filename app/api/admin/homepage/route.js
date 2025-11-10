import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function GET(req) {
  // Try DB, else fallback to cookie
  try {
    const { data, error } = await supabaseServer().from('homepage').select('*').single();
    if (!error && data) return NextResponse.json(data);
  } catch {}
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/admin_homepage=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : '{}';
  return NextResponse.json(JSON.parse(value || '{}'));
}

export async function POST(req) {
  const body = await req.json();
  let ok = true;
  try {
    const { error } = await supabaseServer().from('homepage').upsert(body, { onConflict: 'id' });
    if (error) ok = false;
  } catch {
    ok = false;
  }
  const res = NextResponse.json({ ok });
  // Fallback store in cookie for demo purposes
  if (!ok) {
    res.cookies.set('admin_homepage', encodeURIComponent(JSON.stringify(body)), { path: '/', sameSite: 'lax' });
  }
  return res;
}

