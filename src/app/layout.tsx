import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'SporToto', statusBarStyle: 'default' },
  metadataBase: new URL("https://sportoto.seymata.com"),
  title: 'Spor Toto Optimizasyon | 10 TL Kolon Maliyet Düşürücü',
  description:
    'Garantili formüller (12/13/14/15) ve 15 akıllı filtre ile Spor Toto kupon maliyetlerinizi dramatik şekilde düşürün. 10 TL kolon bedeline karşı en güçlü savunma.',
  keywords: 'spor toto, optimizasyon, garantili sistem, 14 garantili, kolon maliyet',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Spor Toto Optimizasyon',
    description: 'Kupon senaryolarını ve kolon maliyetlerini hesaplamaya yardımcı olan optimizasyon aracı.',
    url: 'https://sportoto.seymata.com',
    siteName: 'Spor Toto Optimizasyon',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Spor Toto Optimizasyon', description: 'Kolon maliyeti ve kupon senaryosu hesaplama aracı.' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Spor Toto Optimizasyon',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          url: 'https://sportoto.seymata.com',
          publisher: { '@type': 'Organization', name: 'STRATEJİ DANIŞMANLIK HİZMETLERİ SAN. VE TİC. A.Ş.', taxID: '7810520457', email: 'info@stratejidanismanlik.com.tr' },
        }) }} />
      </head>
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
      <LegalFooter />
      <script dangerouslySetInnerHTML={{ __html: "if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){window.addEventListener('load', function(){navigator.serviceWorker.register('/sw.js').catch(function(){});})}"}} />
      </body>
    </html>
  );
}


function LegalFooter() { return <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-sm text-slate-600"><div className="flex flex-wrap justify-center gap-4"><a href="/privacy">Gizlilik ve KVKK</a><a href="/terms">Kullanım Koşulları</a><a href="/cookies">Çerez Politikası</a><a href="/contact">İletişim</a></div><p className="mt-3">STRATEJİ DANIŞMANLIK HİZMETLERİ SAN. VE TİC. A.Ş. · <a href="mailto:info@stratejidanismanlik.com.tr">info@stratejidanismanlik.com.tr</a></p></footer>; }

export const viewport = { themeColor: '#116b3a' };
