import LoginClient from '../../components/LoginClient';

export const metadata = { title: 'Login — Zaxis Studio' };

export default function LoginPage() {
  return (
    <section className="center-page">
      <div className="stack-center" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <h1 className="page-title">Login</h1>
        <LoginClient />
      </div>
    </section>
  );
}
