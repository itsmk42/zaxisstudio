import ProductCard from '../components/ProductCard';
import FeaturedItemCard from '../components/FeaturedItemCard';
import CapabilitiesShowcase from '../components/CapabilitiesShowcase';
import Hero from '../components/Hero';
import { getFeaturedProducts } from '../lib/products';
import { listCarouselSlides } from '../lib/carousel';
import { ShoppingBag } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const carouselSlides = await listCarouselSlides();

  // Featured items data with enhanced icon types
  const featuredItems = [
    {
      title: "Custom Keychains",
      description: "Design your own personalized 3D printed keychains with custom text, number plates, or pet tags. Perfect for gifts or personal use.",
      image: "/placeholder.svg",
      buttonText: "Design Now",
      buttonHref: "/custom-keychain",
      iconType: "keychain"
    },
    {
      title: "Photo Lithophanes",
      description: "Transform your favorite photos into stunning 3D printed lithophanes. Beautiful when backlit with soft, glowing illumination.",
      image: "/placeholder.svg",
      buttonText: "Create Yours",
      buttonHref: "/products?category=photobox",
      iconType: "photo"
    }
  ];

  return (
    <>
      <h1 className="sr-only">Zaxis Studio — Custom 3D Printing & Personalized Products</h1>

      {/* Hero Section with Carousel */}
      <Hero slides={carouselSlides} />

      {/* Featured Products Section */}
      <section className="products-section" aria-labelledby="products-heading">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h2 id="products-heading">Featured Products</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Handcrafted 3D printed items ready to ship
            </p>
          </div>
          <div className="grid two">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Use Zaxis Studio - Capabilities Showcase */}
      <CapabilitiesShowcase />

      {/* Custom 3D Printing CTA Section */}
      <section className="featured-section" aria-labelledby="custom-heading">
        <div className="container">
          <div className="featured-section-header">
            <h2 id="custom-heading" className="featured-section-title">
              ✨ Design Your Own
            </h2>
            <p className="featured-section-subtitle">
              Create personalized 3D printed products tailored to your vision
            </p>
          </div>
          <div className="featured-grid">
            {featuredItems.map((item, idx) => (
              <FeaturedItemCard
                key={idx}
                title={item.title}
                description={item.description}
                image={item.image}
                buttonText={item.buttonText}
                buttonHref={item.buttonHref}
                iconType={item.iconType}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop All Products CTA */}
      <section className="shop-all-section" aria-label="Shop All Products">
        <div className="container">
          <a className="shop-all-btn" href="/products" aria-label="Browse all products">
            <ShoppingBag size={20} aria-hidden="true" />
            Shop All Products
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
