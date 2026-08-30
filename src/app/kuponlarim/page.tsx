'use client';
import { useState, useEffect } from 'react';
import { useKuponStore } from '@/store/kupon-store';
import { tlBicimlendir } from '@/lib/vergi';
import { sayiFormat } from '@/lib/utils';
import { Trophy, Trash2, ArrowUpRight, Cloud, Calendar, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function KuponlarimSayfasi() {
  const [kuponlar, setKuponlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [girisGerekli, setGirisGerekli] = useState(false);
  const { setMaclar, setAktifFormul } = useKuponStore();
  const router = useRouter();

  const kuponlariYukle = async () => {
    try {
      const res = await fetch('/api/kuponlar');
      if (res.status === 401) {
        setGirisGerekli(true);
        setYukleniyor(false);
        return;
      }
      const data = await res.json();
      setKuponlar(data.kuponlar || []);
    } catch {
      toast.error('Kuponlar yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    kuponlariYukle();
  }, []);

  const kuponSil = async (id: string) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/kuponlar?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Kupon silindi');
        setKuponlar((prev) => prev.filter((k) => k.id !== id));
      }
    } catch {
      toast.error('Silme işlemi başarısız');
    }
  };

  const kuponuKullan = (kupon: any) => {
    try {
      if (kupon.maclar) setMaclar(kupon.maclar);
      if (kupon.aktifFormul) setAktifFormul(kupon.aktifFormul);
      toast.success('Kupon editöre yüklendi!');
      router.push('/kupon');
    } catch {
      toast.error('Kupon yüklenirken hata oluştu');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 badge badge-brand mb-2">
            <Cloud size={12} />
            Bulut Kuponlarım (PostgreSQL)
          </div>
          <h1 className="text-3xl font-black text-slate-100">
            Kayıtlı <span className="gradient-text">Kuponlarım</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Bulutta saklanan Spor Toto kuponlarınız ve formülleriniz.
          </p>
        </div>

        <Link href="/kupon">
          <button className="btn-primary text-sm flex items-center gap-2">
            <Trophy size={16} />
            Yeni Kupon Oluştur
          </button>
        </Link>
      </div>

      {yukleniyor ? (
        <div className="text-center py-20 text-slate-500">Kuponlar yükleniyor...</div>
      ) : girisGerekli ? (
        <div className="glass-card p-12 text-center max-w-md mx-auto">
          <AlertCircle size={40} color="#818cf8" className="mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-200 mb-2">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-sm text-slate-400 mb-6">
            Kayıtlı kuponlarınızı bulutta saklamak ve görmek için lütfen hesabınıza giriş yapın.
          </p>
        </div>
      ) : kuponlar.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Trophy size={40} color="#64748b" className="mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-300 mb-2">Henüz Kayıtlı Kuponunuz Yok</h2>
          <p className="text-sm text-slate-500 mb-6">
            Kupon oluşturucu üzerinden formülünüzü hazırlayıp "Buluta Kaydet" butonuna basabilirsiniz.
          </p>
          <Link href="/kupon">
            <button className="btn-primary text-sm">İlk Kuponunu Oluştur</button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {kuponlar.map((kupon) => (
            <div
              key={kupon.id}
              className="card p-5 flex flex-col justify-between"
              style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge badge-brand text-xs">
                    {kupon.hafta}. HAFTA
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(kupon.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2">
                  {kupon.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <div>
                    Kolon: <strong className="text-slate-200">{sayiFormat(kupon.toplamKolon)}</strong>
                  </div>
                  <div>
                    Maliyet: <strong className="text-amber-400">{tlBicimlendir(kupon.maliyet)}</strong>
                  </div>
                  {kupon.aktifFormul && (
                    <div className="badge badge-green text-[10px]">
                      {kupon.aktifFormul}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => kuponSil(kupon.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>

                <button
                  onClick={() => kuponuKullan(kupon)}
                  className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
                >
                  Editöre Yükle <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
