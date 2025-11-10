import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req) {
  const body = await req.json();
  const entry = {
    action: body.action || 'unknown',
    payload: body.payload || {},
    actor: 'admin',
    created_at: new Date().toISOString()
  };
  try {
    const { error } = await supabaseServer().from('admin_audit').insert(entry);
    if (error) throw error;
  } catch {
    // Graceful fallback; audit log table may not exist yet
  }
  return NextResponse.json({ ok: true });
}

