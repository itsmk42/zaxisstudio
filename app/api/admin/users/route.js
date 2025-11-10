import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '../../../../lib/supabaseServer';

// Seed or manage admin users
export async function POST(req) {
  const body = await req.json();
  const { username, password, role = 'admin' } = body || {};
  if (!username || !password) return new NextResponse('Missing fields', { status: 400 });
  try {
    const hash = await bcrypt.hash(password, 12);
    const upsert = { username, password_hash: hash, role };
    const { data, error } = await supabaseServer().from('admin_users').upsert(upsert, { onConflict: 'username' }).select('*').single();
    if (error) return new NextResponse(error.message, { status: 500 });
    return NextResponse.json({ ok: true, id: data.id, username: data.username, role: data.role });
  } catch (e) {
    return new NextResponse('Server error', { status: 500 });
  }
}

