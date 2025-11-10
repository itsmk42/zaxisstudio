import { revalidatePath } from 'next/cache';
import { supabaseServer } from '../../../../lib/supabaseServer';
import {
  createCarouselSlide,
  deleteCarouselSlide,
  listCarouselSlides,
  updateCarouselSlide
} from '../../../../lib/carousel';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, price, image_url, button_link, display_order } = body;

    if (!title || !price || !image_url) {
      return Response.json(
        { error: 'Title, price, and image_url are required' },
        { status: 400 }
      );
    }

    // Get the next order number if not provided
    const slides = await listCarouselSlides();
    const order = display_order !== undefined ? display_order : Math.max(...slides.map(s => s.display_order || 0), 0) + 1;

    const newSlide = await createCarouselSlide({
      title,
      price,
      image_url,
      button_link: button_link || '',
      display_order: order,
    });

    revalidatePath('/');
    revalidatePath('/admin/carousel');

    return Response.json(newSlide, { status: 201 });
  } catch (error) {
    console.error('Carousel API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const slides = await listCarouselSlides();
    return Response.json(slides);
  } catch (error) {
    console.error('Carousel API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      );
    }

    await deleteCarouselSlide(id);
    revalidatePath('/');
    revalidatePath('/admin/carousel');

    return Response.json({ success: true });
  } catch (error) {
    console.error('Carousel API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { direction } = body;

    if (!id) {
      return Response.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      );
    }

    // Get all slides
    const slides = await listCarouselSlides();
    const currentSlide = slides.find(s => s.id === id);

    if (!currentSlide) {
      return Response.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    // Find adjacent slide
    const currentIndex = slides.findIndex(s => s.id === id);
    let targetIndex;

    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < slides.length - 1) {
      targetIndex = currentIndex + 1;
    } else {
      return Response.json(
        { error: 'Cannot move in that direction' },
        { status: 400 }
      );
    }

    const targetSlide = slides[targetIndex];

    // Swap display_order values
    const tempOrder = currentSlide.display_order;
    await updateCarouselSlide(id, { display_order: targetSlide.display_order });
    await updateCarouselSlide(targetSlide.id, { display_order: tempOrder });

    revalidatePath('/');
    revalidatePath('/admin/carousel');

    return Response.json({ success: true });
  } catch (error) {
    console.error('Carousel API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

