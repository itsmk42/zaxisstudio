import { listCarouselSlides } from '../../../lib/carousel';
import CarouselForm from '../../../components/admin/CarouselForm';

export const metadata = { title: 'Manage Carousel — Admin' };

export default async function AdminCarousel() {
  const slides = await listCarouselSlides();

  return (
    <section>
      <h1 className="page-title">Hero Carousel</h1>
      <p className="page-subtitle">Manage carousel slides displayed on the homepage</p>
      
      <CarouselForm />
      
      <div className="carousel-preview">
        <h2>Current Carousel Slides</h2>
        <ul className="admin-list">
          {slides.map((slide) => (
            <li key={slide.id} className="admin-item carousel-item">
              <div className="carousel-item-content">
                <div className="carousel-item-image">
                  <img 
                    src={slide.image_url} 
                    alt={slide.title}
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                  />
                </div>
                <div className="carousel-item-info">
                  <strong>{slide.title}</strong>
                  <p>{slide.price}</p>
                  <small>Order: {slide.display_order}</small>
                </div>
              </div>
              <form action={`/api/admin/carousel?id=${slide.id}`} method="POST">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="btn btn-danger">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

