import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Spor Toto Optimizasyon | 10 TL Kolon Maliyet Düşürücü',
  description:
    'Garantili formüller (12/13/14/15) ve 15 akıllı filtre ile Spor Toto kupon maliyetlerinizi dramatik şekilde düşürün. 10 TL kolon bedeline karşı en güçlü savunma.',
  keywords: 'spor toto, optimizasyon, garantili sistem, 14 garantili, kolon maliyet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
