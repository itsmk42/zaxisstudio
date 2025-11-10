import ProductsGrid from '../components/ProductsGrid';
import ProductCard from '../components/ProductCard';
import ProductPlaceholderCard from '../components/ProductPlaceholderCard';
import Hero from '../components/Hero';
import { getFeaturedProducts } from '../lib/products';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const featured = products?.[0] || null;
  const keychain = products.find((p) => /keychain/i.test(p.title || ''));
  const lithophane = products.find((p) => /lithophane/i.test(p.title || ''));
  const showcase = [keychain, lithophane].filter(Boolean);
  return (
    <>
      <h1 className="sr-only">Zaxis Studio — Featured 3D Prints</h1>
      <Hero product={featured} />
      <section className="products-section">
        <div className="grid three">
          {/* 4 placeholders */}
          <ProductPlaceholderCard />
          <ProductPlaceholderCard />
          <ProductPlaceholderCard />
          <ProductPlaceholderCard />
          {/* Target products */}
          {showcase.length > 0 ? (
            showcase.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            products.slice(0, 2).map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </section>
      <section>
        <ProductsGrid products={products} title="Featured" />
      </section>
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
