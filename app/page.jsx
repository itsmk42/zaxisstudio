import ProductCard from '../components/ProductCard';
import FeaturedItemCard from '../components/FeaturedItemCard';
import Hero from '../components/Hero';
import { getFeaturedProducts } from '../lib/products';
import { listCarouselSlides } from '../lib/carousel';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const carouselSlides = await listCarouselSlides();

  // Featured items data
  const featuredItems = [
    {
      title: "Custom Keychains",
      description: "Personalized 3D printed keychains with your custom design",
      image: "/placeholder.svg",
      buttonText: "Learn More",
      buttonHref: "/products?category=keychains"
    },
    {
      title: "Custom Photobox",
      description: "Beautiful 3D printed photo display boxes for your memories",
      image: "/placeholder.svg",
      buttonText: "Learn More",
      buttonHref: "/products?category=photobox"
    }
  ];

  return (
    <>
      <h1 className="sr-only">Zaxis Studio — Featured 3D Prints</h1>
      <Hero slides={carouselSlides} />

      {/* Products Section */}
      <section className="products-section">
        <h2 className="section-heading">Products</h2>
        <div className="grid two">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="products-section">
        <h2 className="section-heading">Featured Items</h2>
        <div className="grid two">
          {featuredItems.map((item, idx) => (
            <FeaturedItemCard
              key={idx}
              title={item.title}
              description={item.description}
              image={item.image}
              buttonText={item.buttonText}
              buttonHref={item.buttonHref}
            />
          ))}
        </div>
      </section>

      {/* Shop All Products CTA */}
      <section aria-label="Shop All Products">
        <div className="container" style={{ display: 'grid', justifyItems: 'center', marginTop: 12 }}>
          <a className="shop-all" href="/products" aria-label="Shop all products">
            Shop All Products <span aria-hidden="true" className="arrow">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
