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
        <footer className="footer">
          <div className="container footer-inner">
            <a className="shop-all" href="/products" aria-label="Shop all products">
              Shop All Products <span aria-hidden="true" className="arrow">→</span>
            </a>
            <span className="footer-copy">© {new Date().getFullYear()} Zaxis Studio</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
