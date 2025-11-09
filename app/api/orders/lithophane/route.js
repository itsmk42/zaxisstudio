import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req) {
  // For simplicity, accept file upload and store metadata; integrate Supabase Storage later
  const payload = {
    items: [{ id: 'custom', title: 'lithophane', price: 0 }],
    customer: {},
    status: 'pending',
    payment: { method: 'COD' },
    custom: { type: 'lithophane' }
  };
  const { data, error } = await supabaseServer().from('orders').insert(payload).select('*').single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}
