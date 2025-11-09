import CheckoutClient from '../../components/CheckoutClient';

export const metadata = { title: 'Checkout — Zaxis Studio' };

export default function CheckoutPage() {
  return (
    <section>
      <h1 className="page-title">Checkout (Cash on Delivery)</h1>
      <CheckoutClient />
    </section>
  );
}
