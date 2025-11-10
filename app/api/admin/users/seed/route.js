import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '../../../../../lib/supabaseServer';

function generateStrongPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?';
  let pwd = '';
  while (pwd.length < 16) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  // Ensure complexity
  if (!/[A-Z]/.test(pwd)) pwd = 'A' + pwd;
  if (!/[a-z]/.test(pwd)) pwd = 'a' + pwd;
  if (!/[0-9]/.test(pwd)) pwd = '1' + pwd;
  if (!/[^A-Za-z0-9]/.test(pwd)) pwd = '!' + pwd;
  return pwd.slice(0, 24);
}

export async function POST(req) {
  // Restrict to development or require token
  const tokenHeader = req.headers.get('x-admin-seed-token') || '';
  const tokenEnv = process.env.ADMIN_SEED_TOKEN || '';
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev && (!tokenEnv || tokenHeader !== tokenEnv)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_URL) {
    return NextResponse.json({ error: 'Supabase service role configuration missing' }, { status: 500 });
  }

  const email = process.env.ADMIN_SEED_EMAIL || `admin+${Date.now()}@example.com`;
  const password = process.env.ADMIN_SEED_PASSWORD || generateStrongPassword();
  const client = supabaseServer();

  try {
    const { data: created, error: adminErr } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });
    if (adminErr) {
      return NextResponse.json({ error: 'Supabase Admin API error', details: { message: adminErr.message } }, { status: 500 });
    }

    const hash = await bcrypt.hash(password, 12);
    const { data, error } = await client
      .from('admin_users')
      .upsert({ username: email, password_hash: hash, role: 'admin' }, { onConflict: 'username' })
      .select('*')
      .single();
    if (error) {
      return NextResponse.json({ error: 'Database error', details: { message: error.message } }, { status: 500 });
    }

    // Return credentials only in development for testing convenience
    const payload = { ok: true, username: data.username, auth_user_id: created?.user?.id || null };
    if (isDev) {
      payload.test_credentials = { email, password };
    }
    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

