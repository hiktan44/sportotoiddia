'use client';
import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  acik: boolean;
  onKapat: () => void;
  onGirisBasarili?: (user: any) => void;
}

export default function AuthModal({ acik, onKapat, onGirisBasarili }: Props) {
  const [mod, setMod] = useState<'giris' | 'kayit'>('giris');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  if (!acik) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);

    try {
      const endpoint = mod === 'giris' ? '/api/auth/login' : '/api/auth/register';
      const body = mod === 'giris' ? { email, password } : { email, password, name };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'İşlem başarısız');
        setYukleniyor(false);
        return;
      }

      toast.success(mod === 'giris' ? 'Giriş yapıldı!' : 'Kayıt başarılı!');
      if (onGirisBasarili) onGirisBasarili(data.user);
      onKapat();
      window.location.reload();
    } catch {
      toast.error('Bağlantı hatası oluştu');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 24,
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {mod === 'giris' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </h2>
          <button
            onClick={onKapat}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mod === 'kayit' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4, display: 'block' }}>
                Ad Soyad
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 12 }} />
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-dark"
                  style={{ paddingLeft: 34 }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4, display: 'block' }}>
              E-Posta Adresi
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 12 }} />
              <input
                type="email"
                required
                placeholder="ahmet@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
                style={{ paddingLeft: 34 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 4, display: 'block' }}>
              Şifre
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 12 }} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark"
                style={{ paddingLeft: 34 }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="btn-primary"
            style={{
              marginTop: 10,
              padding: '12px',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {mod === 'giris' ? <LogIn size={16} /> : <UserPlus size={16} />}
            {yukleniyor ? 'Lütfen bekleyin...' : mod === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
          {mod === 'giris' ? (
            <div>
              Hesabınız yok mu?{' '}
              <button
                onClick={() => setMod('kayit')}
                style={{ color: '#818cf8', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Hemen Kaydolun
              </button>
            </div>
          ) : (
            <div>
              Zaten hesabınız var mı?{' '}
              <button
                onClick={() => setMod('giris')}
                style={{ color: '#818cf8', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Giriş Yapın
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
