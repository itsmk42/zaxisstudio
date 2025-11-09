import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  const { data, error } = await supabaseServer().from('seo').select('*');
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req) {
  // Support both form-encoded and JSON
  const contentType = req.headers.get('content-type') || '';
  let body = {};
  if (contentType.includes('application/json')) {
    body = await req.json();
  } else {
    const form = await req.formData();
    body = Object.fromEntries(form);
  }
  const upsert = { key: body.key, title: body.title, description: body.description };
  const { data, error } = await supabaseServer().from('seo').upsert(upsert, { onConflict: 'key' }).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
