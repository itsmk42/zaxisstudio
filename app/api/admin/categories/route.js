import { revalidatePath } from 'next/cache';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function GET(request) {
  try {
    const { data, error } = await supabaseServer()
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return Response.json(data || []);
  } catch (error) {
    console.error('Categories API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return Response.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const { data: existing } = await supabaseServer()
      .from('categories')
      .select('id')
      .eq('name', name.trim())
      .single();

    if (existing) {
      return Response.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }

    // Create new category
    const { data, error } = await supabaseServer()
      .from('categories')
      .insert([{ name: name.trim() }])
      .select();

    if (error) throw error;

    revalidatePath('/admin/products');

    return Response.json(data?.[0] || null, { status: 201 });
  } catch (error) {
    console.error('Categories API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

