import Link from 'next/link';

export const metadata = { title: 'Admin — Zaxis Studio' };

export default function AdminHome() {
  return (
    <section>
      <h1 className="page-title">Admin</h1>
      <div className="admin-grid">
        <Link className="admin-card" href="/admin/products">Manage Products</Link>
        <Link className="admin-card" href="/admin/orders">Manage Orders</Link>
        <Link className="admin-card" href="/admin/seo">Manage SEO</Link>
      </div>
    </section>
  );
}
