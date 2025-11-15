"use client";
import ProductCard from './ProductCard';
import CustomLithophaneCard from './CustomLithophaneCard';

export default function ProductsGrid({ products, title, minimal, showCustomLithophane = false }) {
  return (
    <section className="products-section">
      {title && !minimal && <h2>{title}</h2>}
      <div className="grid three">
        {showCustomLithophane && <CustomLithophaneCard />}
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
