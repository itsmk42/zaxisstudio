import { supabaseServer } from './supabaseServer';

export async function listProducts() {
  try {
    const { data, error } = await supabaseServer().from('products').select('*').order('id', { ascending: false });
    if (error) throw error;
    // If the table exists but has no rows, provide demo content to avoid a blank homepage.
    // This improves UX in new/staging environments before real products are added.
    if (!data || data.length === 0) {
      return [
        { id: 1, title: 'Custom Keychain', price: 199, image_url: '/placeholder.svg' },
        { id: 2, title: 'Lithophane Photo Box', price: 1299, image_url: '/placeholder.svg' },
        { id: 3, title: 'Desk Nameplate', price: 499, image_url: '/placeholder.svg' }
      ];
    }
    return data;
  } catch {
    // Fallback demo content if Supabase isn't configured yet
    return [
      { id: 1, title: 'Custom Keychain', price: 199, image_url: '/placeholder.svg' },
      { id: 2, title: 'Lithophane Photo Box', price: 1299, image_url: '/placeholder.svg' },
      { id: 3, title: 'Desk Nameplate', price: 499, image_url: '/placeholder.svg' }
    ];
  }
}

export async function getFeaturedProducts() {
  const all = await listProducts();
  return all.slice(0, 6);
}

export async function getProductById(id) {
  try {
    const { data, error } = await supabaseServer().from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data || null;
  } catch {
    const all = await listProducts();
    return all.find((p) => String(p.id) === String(id)) || null;
  }
}
