import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  const { data, error } = await supabaseServer().from('orders').select('*').order('id', { ascending: false });
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
  // Method override
  if (body._method === 'PATCH') {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || body.id;
    const { data, error } = await supabaseServer().from('orders').update({ status: body.status }).eq('id', id).select('*').single();
    if (error) return new NextResponse(error.message, { status: 500 });
    return NextResponse.json(data);
  }
  const payload = {
    items: body.items || [],
    customer: body.customer || {},
    status: 'pending',
    payment: body.payment || { method: 'COD' }
  };
  const { data, error } = await supabaseServer().from('orders').insert(payload).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const body = await req.json();
  const { data, error } = await supabaseServer().from('orders').update({ status: body.status }).eq('id', id).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
