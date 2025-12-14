import { supabaseServer } from './supabaseServer';

export async function listCarouselSlides() {
  try {
    const { data, error } = await supabaseServer()
      .from('carousel_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[carousel] Supabase error:', error);
      throw error;
    }

    // Log fetched data for debugging
    console.log('[carousel] Fetched slides from database:', {
      count: data?.length || 0,
      slides: data?.map(s => ({ id: s.id, title: s.title, image_url: s.image_url?.substring(0, 50) }))
    });

    // If the table exists but has no rows, provide demo content
    if (!data || data.length === 0) {
      console.log('[carousel] No slides in database, returning demo content');
      return [
        {
          id: 1,
          title: 'Custom Keychains',
          price: '₹199',
          image_url: '/placeholder.svg',
          display_order: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'Lithophane Photo Box',
          price: '₹1299',
          image_url: '/placeholder.svg',
          display_order: 2,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'Desk Nameplate',
          price: '₹499',
          image_url: '/placeholder.svg',
          display_order: 3,
          created_at: new Date().toISOString(),
        },
      ];
    }

    return data;
  } catch (error) {
    console.error('[carousel] Error fetching carousel slides:', error);
    // Fallback demo content
    return [
      {
        id: 1,
        title: 'Custom Keychains',
        price: '₹199',
        image_url: '/placeholder.svg',
        display_order: 1,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Lithophane Photo Box',
        price: '₹1299',
        image_url: '/placeholder.svg',
        display_order: 2,
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Desk Nameplate',
        price: '₹499',
        image_url: '/placeholder.svg',
        display_order: 3,
        created_at: new Date().toISOString(),
      },
    ];
  }
}

export async function getCarouselSlideById(id) {
  try {
    const { data, error } = await supabaseServer()
      .from('carousel_slides')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching carousel slide:', error);
    return null;
  }
}

export async function createCarouselSlide(slide) {
  try {
    const { data, error } = await supabaseServer()
      .from('carousel_slides')
      .insert([slide])
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    throw error;
  }
}

export async function updateCarouselSlide(id, updates) {
  try {
    const { data, error } = await supabaseServer()
      .from('carousel_slides')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    throw error;
  }
}

export async function deleteCarouselSlide(id) {
  try {
    const { error } = await supabaseServer()
      .from('carousel_slides')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    throw error;
  }
}

export async function reorderCarouselSlides(slides) {
  try {
    const updates = slides.map((slide, index) => ({
      id: slide.id,
      display_order: index + 1,
    }));

    const { error } = await supabaseServer()
      .from('carousel_slides')
      .upsert(updates);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error reordering carousel slides:', error);
    throw error;
  }
}

