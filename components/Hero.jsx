"use client";
import Image from 'next/image';

export default function Hero({ products = [] }) {
  // Display first 3 products as static cards
  const heroProducts = products.slice(0, 3);

  const renderProductCard = (product) => {
    if (!product) return null;

    const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url);
    const src = isStock ? '/placeholder.svg' : product.image_url;
    const alt = isStock ? `Image Coming Soon — ${product.title}` : product.title;

    return (
      <article key={product.id} className="hero-card">
        <div className="hero-media">
          <Image src={src} alt={alt} width={400} height={300} />
        </div>
        <div className="hero-info">
          <h2 className="hero-title">{product.title}</h2>
          <p className="hero-price">₹{product.price}</p>
          <a
            className="btn primary"
            href={`/product/${product.id}`}
            aria-label={`Shop ${product.title} now`}
          >
            Shop Now
          </a>
        </div>
      </article>
    );
  };

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-cards-grid" role="region" aria-label="Featured products">
          {heroProducts.map((product) => renderProductCard(product))}
        </div>
      </div>
    </section>
  );
}
