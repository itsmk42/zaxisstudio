import { revalidatePath } from 'next/cache';
import { 
  createCarouselSlide, 
  deleteCarouselSlide, 
  listCarouselSlides 
} from '../../../../lib/carousel';

export async function POST(request) {
  try {
    const body = await request.json();
    const { _method } = body;

    // Handle DELETE
    if (_method === 'DELETE') {
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
    }

    // Handle CREATE
    const { title, price, image_url } = body;

    if (!title || !price || !image_url) {
      return Response.json(
        { error: 'Title, price, and image_url are required' },
        { status: 400 }
      );
    }

    // Get the next order number
    const slides = await listCarouselSlides();
    const nextOrder = Math.max(...slides.map(s => s.order || 0), 0) + 1;

    const newSlide = await createCarouselSlide({
      title,
      price,
      image_url,
      order: nextOrder,
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

