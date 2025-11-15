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
    <section>
      <h1 className="page-title">Products</h1>
      <ProductsGrid products={products} showCustomLithophane={true} />
    </section>
  );
}
