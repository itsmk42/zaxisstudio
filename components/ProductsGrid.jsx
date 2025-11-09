"use client";
import ProductCard from './ProductCard';

export default function ProductsGrid({ products, title, minimal }) {
  return (
    <section className="products-section">
      {title && !minimal && <h2>{title}</h2>}
      <div className="grid three">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
