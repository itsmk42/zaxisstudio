import ProductCard from '../components/ProductCard';
import FeaturedItemCard from '../components/FeaturedItemCard';
import Hero from '../components/Hero';
import ArchitectureWireframe from '../components/ArchitectureWireframe';
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

      {/* Architecture & Design Process Section */}
      <section className="wireframe-section" aria-labelledby="design-heading">
        <div className="wireframe-container">
          <div className="wireframe-content">
            <div className="wireframe-text">
              <h2 id="design-heading" className="wireframe-heading">
                Precision Design & Manufacturing
              </h2>
              <p className="wireframe-subheading">
                Advanced 3D Architecture for Custom Creations
              </p>

              <div className="wireframe-features">
                <div className="feature-item">
                  <h3 className="feature-title">Custom Design</h3>
                  <p className="feature-description">
                    Our team works with you to create bespoke 3D designs tailored to your exact specifications. From concept to reality, we ensure every detail is perfect.
                  </p>
                </div>

                <div className="feature-item">
                  <h3 className="feature-title">Precision Manufacturing</h3>
                  <p className="feature-description">
                    Using state-of-the-art 3D printing technology, we manufacture products with exceptional accuracy and quality. Each piece is carefully crafted to meet the highest standards.
                  </p>
                </div>

                <div className="feature-item">
                  <h3 className="feature-title">Quality Assurance</h3>
                  <p className="feature-description">
                    Every product undergoes rigorous quality checks before delivery. We're committed to providing you with flawless, durable 3D printed items.
                  </p>
                </div>

                <div className="feature-item">
                  <h3 className="feature-title">Sustainable Production</h3>
                  <p className="feature-description">
                    We use eco-friendly materials and processes to minimize waste. Our commitment to sustainability ensures responsible manufacturing practices.
                  </p>
                </div>
              </div>

              <p className="wireframe-description">
                At Zaxis Studio, we combine cutting-edge 3D printing technology with meticulous craftsmanship. Our architectural approach to design ensures that every product is not just manufactured, but engineered for perfection. Whether you're looking for custom keychains, photo boxes, or unique 3D printed creations, we bring your vision to life with precision and care.
              </p>

              <a href="/custom" className="wireframe-cta">
                Start Your Custom Project <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="wireframe-visual">
              <ArchitectureWireframe />
            </div>
          </div>
        </div>
      </section>

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
