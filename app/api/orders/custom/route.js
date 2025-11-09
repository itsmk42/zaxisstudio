import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req) {
  const body = await req.json();
  const payload = {
    items: [{ id: 'custom', title: body.type, price: 0 }],
    customer: {},
    status: 'pending',
    payment: { method: 'COD' },
    custom: body
  };
  const { data, error } = await supabaseServer().from('orders').insert(payload).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
