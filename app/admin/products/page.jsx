import { listProducts } from '../../../lib/products';
import ProductForm from '../../../components/ProductForm';

export const metadata = { title: 'Manage Products — Admin' };

export default async function AdminProducts() {
  const products = await listProducts();
  return (
    <section>
      <h1 className="page-title">Products</h1>
      <ProductForm />
      <ul className="admin-list">
        {products.map((p) => (
          <li key={p.id} className="admin-item">
            <span>{p.title} — ₹{p.price}</span>
            <form action={`/api/products?id=${p.id}`} method="POST">
              <input type="hidden" name="_method" value="DELETE" />
              <button className="btn">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
