import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  if (!email && !phone) {
    return new NextResponse('Email or phone parameter is required', { status: 400 });
  }

  try {
    let query = supabaseServer().from('orders').select('*');

    if (email) {
      // Use filter with ilike for JSONB field - search customer->email
      query = query.filter('customer->email', 'ilike', `%${email}%`);
    } else if (phone) {
      // Use filter with ilike for JSONB field - search customer->phone
      query = query.filter('customer->phone', 'ilike', `%${phone}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching orders:', error);
      console.error('Error details:', error.message, error.code);
      return new NextResponse(JSON.stringify({ error: error.message, code: error.code }), { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Error in search endpoint:', err);
    return new NextResponse(JSON.stringify({ error: 'Internal server error', details: err.message }), { status: 500 });
  }
}

