import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  const { data, error } = await supabaseServer().from('products').select('*');
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req) {
  const contentType = req.headers.get('content-type') || '';
  let body = {};
  if (contentType.includes('application/json')) {
    body = await req.json();
  } else {
    const form = await req.formData();
    body = Object.fromEntries(form);
  }
  // Support method override via form _method
  if (body._method === 'DELETE') {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || body.id;
    const { error } = await supabaseServer().from('products').delete().eq('id', id);
    if (error) return new NextResponse(error.message, { status: 500 });
    return NextResponse.json({ ok: true });
  }
  if (body._method === 'PUT' || body._method === 'PATCH') {
    const { id, ...update } = body;
    const { data, error } = await supabaseServer().from('products').update(update).eq('id', id).select('*').single();
    if (error) return new NextResponse(error.message, { status: 500 });
    return NextResponse.json(data);
  }
  const payload = { title: body.title, price: Number(body.price), image_url: body.image_url };
  const { data, error } = await supabaseServer().from('products').insert(payload).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, ...update } = body;
  const { data, error } = await supabaseServer().from('products').update(update).eq('id', id).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function POST_form(req) { /* not used */ }

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { error } = await supabaseServer().from('products').delete().eq('id', id);
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ ok: true });
}
