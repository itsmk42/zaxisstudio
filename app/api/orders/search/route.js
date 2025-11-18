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
      query = query.ilike('customer->email', `%${email}%`);
    } else if (phone) {
      query = query.ilike('customer->phone', `%${phone}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching orders:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Error in search endpoint:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

