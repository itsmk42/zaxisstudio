import { getAllSeo } from '../../../lib/seo';

export const metadata = { title: 'Manage SEO — Admin' };

export default async function AdminSEO() {
  const seo = await getAllSeo();
  return (
    <section>
      <h1 className="page-title">SEO Management</h1>
      <form action="/api/seo" method="POST" className="form">
        <label>
          Page Key
          <input name="key" placeholder="products" />
        </label>
        <label>
          Title
          <input name="title" placeholder="Products — Zaxis Studio" />
        </label>
        <label>
          Description
          <textarea name="description" placeholder="Browse 3D printed products." />
        </label>
        <button className="btn primary" type="submit">Save Meta</button>
      </form>
      <ul className="admin-list">
        {seo.map((m) => (
          <li key={m.key} className="admin-item">
            <strong>{m.key}</strong> — {m.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
