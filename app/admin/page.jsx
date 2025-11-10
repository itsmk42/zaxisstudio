import AdminDashboardClient from '../../components/admin/AdminDashboardClient';

export const metadata = { title: 'Admin — Zaxis Studio' };

export default function AdminHome() {
  return (
    <section>
      <AdminDashboardClient />
    </section>
  );
}
