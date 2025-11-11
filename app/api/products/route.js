import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseServer } from '../../../lib/supabaseServer';

function json(status, payload) {
  return NextResponse.json(payload, { status });
}

function validatePayload(body) {
  const errors = [];
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const price = Number(body.price);
  const image_url = typeof body.image_url === 'string' ? body.image_url.trim() : '';

  if (!title) errors.push('title is required');
  if (!Number.isFinite(price) || price < 0) errors.push('price must be a non-negative number');
  if (!image_url) errors.push('image_url is required');

  return {
    valid: errors.length === 0,
    errors,
    title,
    price,
    image_url,
    description: body.description || '',
    sku: body.sku || '',
    inventory: Number(body.inventory) || 0,
    category: body.category || '',
    tags: body.tags || '',
    seo_title: body.seo_title || '',
    seo_description: body.seo_description || '',
  };
}

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
  // Explicit environment sanity for writes: requires service role key
  if (!process.env.SUPABASE_URL) {
    return json(500, { error: 'Supabase URL not configured (SUPABASE_URL).' });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: 'Supabase service role key missing (SUPABASE_SERVICE_ROLE_KEY). Writes are not permitted.' });
  }
  // Support method override via form _method
  if (body._method === 'DELETE') {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || body.id;
    const { error } = await supabaseServer().from('products').delete().eq('id', id);
    if (error) {
      console.error('[products:delete] error', error);
      return json(500, { error: error.message });
    }
    // Revalidate cached pages when product is deleted
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/product/[id]', 'page');
    } catch (e) {
      console.warn('[products:delete] cache revalidation warning', e);
    }
    return json(200, { ok: true });
  }
  if (body._method === 'PUT' || body._method === 'PATCH') {
    const { id, _method, ...update } = body;
    const { data, error } = await supabaseServer().from('products').update(update).eq('id', id).select('*').single();
    if (error) {
      console.error('[products:update] error', error);
      return json(500, { error: error.message });
    }
    // Revalidate cached pages when product is updated
    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/product/[id]', 'page');
    } catch (e) {
      console.warn('[products:update] cache revalidation warning', e);
    }
    return json(200, data);
  }
  const { valid, errors, title, price, image_url, description, sku, inventory, category, tags, seo_title, seo_description } = validatePayload(body);
  if (!valid) {
    return json(400, { error: 'validation_failed', details: errors });
  }

  const payload = {
    title,
    price,
    image_url,
    description,
    sku,
    inventory,
    category,
    tags,
    seo_title,
    seo_description,
  };

  const { data, error } = await supabaseServer().from('products').insert(payload).select('*').single();
  if (error) {
    console.error('[products:create] error', error, { payload });
    const message = String(error?.message || 'unknown');
    if (message.includes("Could not find the table 'public.products'")) {
      return json(500, { error: 'table_missing', details: ['products table not found — apply migration at db/products.sql'] });
    }
    return json(500, { error: message });
  }
  // Revalidate cached pages when new product is created
  try {
    revalidatePath('/');
    revalidatePath('/products');
  } catch (e) {
    console.warn('[products:create] cache revalidation warning', e);
  }
  return json(201, data);
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
  // Revalidate cached pages when product is deleted
  try {
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/product/[id]', 'page');
  } catch (e) {
    console.warn('[products:delete] cache revalidation warning', e);
  }
  return NextResponse.json({ ok: true });
}
