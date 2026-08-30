'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Filter, Calculator, Users, BarChart3, Zap, BookOpen, Activity, Cloud, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: Zap },
  { href: '/kupon', label: 'Kupon Oluştur', icon: Trophy },
  { href: '/filtreler', label: 'Filtreler', icon: Filter },
  { href: '/canli-takip', label: 'Canlı Takip', icon: Activity },
  { href: '/kuponlarim', label: 'Kuponlarım', icon: Cloud },
  { href: '/hesaplama', label: 'Vergi Hesap', icon: Calculator },
  { href: '/ortak-kupon', label: 'Ortak Kasa', icon: Users },
  { href: '/kilavuz', label: 'Kılavuz', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [authModalAcik, setAuthModalAcik] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Çıkış yapıldı');
      window.location.reload();
    } catch {}
  };

  return (
    <>
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
                <span className="hidden lg:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-slate-300 font-semibold">
                  {user.name || user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
                  title="Çıkış Yap"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalAcik(true)}
                className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
              >
                <LogIn size={13} />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        acik={authModalAcik}
        onKapat={() => setAuthModalAcik(false)}
        onGirisBasarili={(u) => setUser(u)}
      />
    </>
  );
}
