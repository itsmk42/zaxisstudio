import CartClient from '../../components/CartClient';

export const metadata = { title: 'Cart — Zaxis Studio' };

export default function CartPage() {
  return (
    <section>
      <h1 className="page-title">Cart</h1>
      <CartClient />
    </section>
  );
}
