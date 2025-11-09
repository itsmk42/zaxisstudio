import { supabaseServer } from './supabaseServer';

export async function getPageSeo(key) {
  try {
    const { data, error } = await supabaseServer().from('seo').select('*').eq('key', key).single();
    if (error) throw error;
    return data ? { title: data.title, description: data.description } : null;
  } catch {
    return null;
  }
}

export async function getAllSeo() {
  try {
    const { data, error } = await supabaseServer().from('seo').select('*');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}
