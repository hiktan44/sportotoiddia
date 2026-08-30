'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Filter, Calculator, Users, BarChart3, Zap, BookOpen, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: Zap },
  { href: '/kupon', label: 'Kupon Oluştur', icon: Trophy },
  { href: '/filtreler', label: 'Filtreler', icon: Filter },
  { href: '/canli-takip', label: 'Canlı Takip', icon: Activity },
  { href: '/hesaplama', label: 'Vergi Hesap', icon: Calculator },
  { href: '/ortak-kupon', label: 'Ortak Kasa', icon: Users },
  { href: '/kilavuz', label: 'Kılavuz', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: 'rgba(10, 14, 26, 0.95)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>
              Spor<span style={{ color: '#818cf8' }}>Toto</span>
              <span style={{ color: '#10b981' }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: -2 }}>
              10 TL Kolon Optimizatörü
            </div>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn('nav-link', pathname === href && 'aktif')}
            >
              <Icon size={15} />
              <span className="hidden md:block">{label}</span>
            </Link>
          ))}
        </div>

        {/* 10 TL Badge */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          1 Kolon = 10 TL
        </div>
      </div>
    </nav>
  );
}
