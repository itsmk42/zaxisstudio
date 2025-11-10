import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Zaxis Studio — 3D Printed Products',
  description: 'Minimalist store showcasing 3D printed products by Zaxis Studio.',
  openGraph: {
    type: 'website',
    title: 'Zaxis Studio',
    description: 'Minimalist store showcasing 3D printed products.',
    url: 'https://zaxisstudio.com',
    siteName: 'Zaxis Studio'
  }
};

// Navbar moved to client component for mobile menu interactions

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} site-grid-bg`}>
        <Navbar />
        <main className="container">{children}</main>
        <footer className="footer navbar-dark" role="contentinfo">
          <div className="container footer-inner">
            <div className="tnc" aria-label="Terms & Conditions">
              <h2 className="tnc-title">Terms & Conditions</h2>
              <p className="tnc-text">
                By using this site and purchasing, you agree to our policies on shipping,
                returns, warranties, and privacy. Custom-manufactured items may vary slightly.
                For assistance, please contact support.
              </p>
            </div>
            <span className="footer-copy">© {new Date().getFullYear()} Zaxis Studio</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
