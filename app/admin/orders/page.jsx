import { listOrders } from '../../../lib/orders';

export const metadata = { title: 'Manage Orders — Admin' };

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <section>
      <h1 className="page-title">Orders</h1>
      <ul className="admin-list">
        {orders.map((o) => (
          <li key={o.id} className="admin-item">
            <div>
              <strong>#{o.id}</strong> — {o.customer_name} ({o.customer_phone}) — {o.status}
            </div>
            <div>Items: {o.items?.map((i) => i.title).join(', ')}</div>
            <form action={`/api/orders?id=${o.id}`} method="POST" className="inline">
              <input type="hidden" name="_method" value="PATCH" />
              <select name="status" defaultValue={o.status}>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="shipped">shipped</option>
                <option value="completed">completed</option>
              </select>
              <button className="btn">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
