import { getProductById, listProducts } from '../../../lib/products';
import ProductDetailClient from '../../../components/ProductDetailClient';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }
  return {
    title: `${product.title} | Zaxis Studio`,
    description: product.description || `Buy ${product.title} from Zaxis Studio. Price: ₹${product.price}`,
    openGraph: {
      title: product.title,
      description: product.description || `Buy ${product.title}`,
      images: [product.image_url || '/placeholder.svg'],
    },
  };
}

export default async function ProductDetail({ params }) {
  const product = await getProductById(params.id);
  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 16px' }}>
        <h1>Product Not Found</h1>
        <p>The product you are looking for does not exist.</p>
        <a href="/products" className="btn primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Back to Products
        </a>
      </div>
    );
  }

  // Get related products (exclude current product)
  const allProducts = await listProducts();
  const relatedProducts = allProducts
    .filter((p) => String(p.id) !== String(params.id))
    .slice(0, 6);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
