import ProductsGrid from '../../components/ProductsGrid';
import { listProducts } from '../../lib/products';
import { getPageSeo } from '../../lib/seo';

export async function generateMetadata() {
  const meta = await getPageSeo('products');
  return meta || { title: 'Products — Zaxis Studio', description: 'Browse 3D printed products.' };
}

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await listProducts();
  return (
    <div className="products-page">
      <header className="products-page-header">
        <div className="container">
          <span className="section-badge">🎨 Shop Collection</span>
          <h1 className="page-title">Our Products</h1>
          <p className="products-subtitle">
            Handcrafted 3D printed items with precision and care
          </p>
        </div>
      </header>
      <div className="container">
        <ProductsGrid products={products} showCustomLithophane={true} />
      </div>
    </div>
  );
}
