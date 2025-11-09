import { supabaseServer } from './supabaseServer';

export async function listOrders() {
  try {
    const { data, error } = await supabaseServer().from('orders').select('*').order('id', { ascending: false });
    if (error) throw error;
    return (data || []).map((o) => ({
      id: o.id,
      items: o.items,
      status: o.status,
      customer_name: o.customer?.name,
      customer_phone: o.customer?.phone
    }));
  } catch {
    return [];
  }
}
