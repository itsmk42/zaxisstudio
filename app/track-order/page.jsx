import TrackOrderClient from '../../components/TrackOrderClient';

export const metadata = {
  title: 'Track Your Order — Zaxis Studio',
  description: 'Track your order status using your email or phone number'
};

export default function TrackOrderPage() {
  return (
    <section>
      <h1 className="page-title">Track Your Order</h1>
      <TrackOrderClient />
    </section>
  );
}

