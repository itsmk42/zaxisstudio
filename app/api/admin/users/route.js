import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '../../../../lib/supabaseServer';

function validatePassword(password) {
  const minLen = 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const errors = [];
  if (!password || password.length < minLen) errors.push(`Password must be at least ${minLen} characters`);
  if (!hasUpper) errors.push('Password must include an uppercase letter');
  if (!hasLower) errors.push('Password must include a lowercase letter');
  if (!hasNumber) errors.push('Password must include a number');
  if (!hasSpecial) errors.push('Password must include a special character');
  return { ok: errors.length === 0, errors };
}

// Seed or manage admin users
export async function POST(req) {
  const body = await req.json();
  // Accept both username and email for compatibility; prefer email.
  const { username, email, password, role = 'admin' } = body || {};
  const ident = email || username;
  if (!ident || !password) {
    return NextResponse.json({ error: 'Missing fields', details: { required: ['email or username', 'password'] } }, { status: 400 });
  }
  const pw = validatePassword(password);
  if (!pw.ok) {
    return NextResponse.json({ error: 'Invalid password', details: { rules: pw.errors } }, { status: 400 });
  }
  try {
    const client = supabaseServer();
    // Create Supabase Auth user via Admin API when service role key is present
    const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    let authUser = null;
    if (hasService) {
      const { data: created, error: adminErr } = await client.auth.admin.createUser({
        email: ident,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });
      if (adminErr) {
        const duplicate = (adminErr.status === 422) || /already been registered/i.test(adminErr.message || '');
        if (!duplicate) {
          return NextResponse.json({ error: 'Supabase Admin API error', details: { message: adminErr.message, code: adminErr.status || undefined } }, { status: 500 });
        }
        // Proceed with local upsert if user already exists in Supabase Auth
        authUser = null;
      } else {
        authUser = created;
      }
    }

    const hash = await bcrypt.hash(password, 12);
    const upsert = { username: ident, password_hash: hash, role };
    const { data, error } = await client
      .from('admin_users')
      .upsert(upsert, { onConflict: 'username' })
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: 'Database error', details: { message: error.message } }, { status: 500 });
    return NextResponse.json({ ok: true, id: data.id, username: data.username, role: data.role, auth_user_id: authUser?.user?.id || null });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
