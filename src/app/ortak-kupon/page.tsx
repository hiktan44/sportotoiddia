'use client';
import { useState } from 'react';
import { useKuponStore } from '@/store/kupon-store';
import { kasaDagilimHesapla, tlBicimlendir } from '@/lib/vergi';
import { sayiFormat } from '@/lib/utils';
import {
  Users, Plus, Trash2, Calculator, Trophy,
  BarChart3, CheckCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrtakKuponSayfasi() {
  const { kolonSayisi, maliyet, kasaUyeleri, kasaUyesiEkle, kasaUyesiSil, kasaUyesiGuncelle } = useKuponStore();
  const [yeniAd, setYeniAd] = useState('');
  const [yeniKatki, setYeniKatki] = useState('');
  const [ikramiye, setIkramiye] = useState(1_000_000);

  const toplamKatki = kasaUyeleri.reduce((sum, u) => sum + u.katkiTL, 0);
  const karsilanabilirKolon = Math.floor(toplamKatki / 10);
  const eksikTL = Math.max(0, maliyet - toplamKatki);
  const fazlaTL = Math.max(0, toplamKatki - maliyet);

  const dagilim = kasaDagilimHesapla(
    kasaUyeleri.map((u) => ({ id: u.id, ad: u.ad, katkiTL: u.katkiTL })),
    ikramiye
  );

  const uyeEkle = () => {
    if (!yeniAd.trim() || !yeniKatki || Number(yeniKatki) <= 0) {
      toast.error('Ad ve geçerli katkı miktarı girin');
      return;
    }
    kasaUyesiEkle(yeniAd.trim(), Number(yeniKatki));
    setYeniAd('');
    setYeniKatki('');
    toast.success(`${yeniAd} kasaya eklendi`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 badge badge-brand mb-4">
          <Users size={12} />
          Ortak Kasa Modülü
        </div>
        <h1 className="text-4xl font-black text-slate-100 mb-3">
          Ortak <span className="gradient-text">Kasa</span> Sistemi
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          10 TL kolon maliyeti bireysel oyuncular için çok zorlaştı.
          Bütçeleri birleştirerek devasa kasalar oluşturun, kazanç pay oranında dağıtılır.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* ===== SOL: KASA KURULUMU ===== */}
        <div className="space-y-4">
          {/* Kupon Bilgisi */}
          <div
            className="card p-5"
            style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}
          >
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Trophy size={15} color="#818cf8" />
              Mevcut Kupon
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(15,22,41,0.8)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#818cf8' }}>
                  {sayiFormat(kolonSayisi)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Kolon</div>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(15,22,41,0.8)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>
                  {tlBicimlendir(maliyet)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Toplam Maliyet</div>
              </div>
            </div>
          </div>

          {/* Üye Ekleme */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Plus size={15} color="#10b981" />
              Kasa Üyesi Ekle
            </h3>
            <div className="space-y-3">
              <input
                className="input-dark"
                placeholder="Oyuncu adı (örn. Ahmet)"
                value={yeniAd}
                onChange={(e) => setYeniAd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && uyeEkle()}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  className="input-dark"
                  placeholder="Katkı miktarı (₺)"
                  value={yeniKatki}
                  onChange={(e) => setYeniKatki(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && uyeEkle()}
                />
                <button className="btn-success" onClick={uyeEkle} style={{ flexShrink: 0 }}>
                  Ekle
                </button>
              </div>
            </div>
          </div>

          {/* Üye Listesi */}
          {kasaUyeleri.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-200 mb-4">
                Kasa Üyeleri ({kasaUyeleri.length})
              </h3>
              <div className="space-y-2">
                {kasaUyeleri.map((uye) => {
                  const payOrani = toplamKatki > 0 ? (uye.katkiTL / toplamKatki) * 100 : 0;
                  return (
                    <div
                      key={uye.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(15, 22, 41, 0.6)', border: '1px solid rgba(99,102,241,0.1)' }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: 'rgba(99, 102, 241, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#818cf8',
                          flexShrink: 0,
                        }}
                      >
                        {uye.ad.charAt(0).toUpperCase()}
                      </div>

                      {/* Ad */}
                      <input
                        className="text-slate-200 font-semibold text-sm bg-transparent border-none outline-none flex-1 min-w-0"
                        value={uye.ad}
                        onChange={(e) => kasaUyesiGuncelle(uye.id, 'ad', e.target.value)}
                      />

                      {/* Katkı */}
                      <input
                        type="number"
                        className="text-slate-200 font-bold text-sm text-right bg-transparent border-none outline-none"
                        style={{ width: 80 }}
                        value={uye.katkiTL}
                        onChange={(e) => kasaUyesiGuncelle(uye.id, 'katkiTL', Number(e.target.value))}
                      />
                      <span style={{ fontSize: 11, color: '#64748b' }}>₺</span>

                      {/* Pay */}
                      <div
                        className="badge badge-brand text-xs"
                        style={{ flexShrink: 0 }}
                      >
                        %{payOrani.toFixed(1)}
                      </div>

                      {/* Sil */}
                      <button
                        onClick={() => {
                          kasaUyesiSil(uye.id);
                          toast.success(`${uye.ad} kasadan çıkarıldı`);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} color="#64748b" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ===== SAĞ: KASA ÖZETİ & KAZANÇ ===== */}
        <div className="space-y-4">
          {/* Kasa Durumu */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">
              Kasa Durumu
            </h3>

            <div className="text-center mb-6">
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: toplamKatki >= maliyet ? '#34d399' : '#f87171',
                  lineHeight: 1,
                }}
              >
                {tlBicimlendir(toplamKatki)}
              </div>
              <div className="text-slate-400 text-sm mt-2">Toplam Kasa</div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Kasa Doluluk Oranı</span>
                <span>{maliyet > 0 ? Math.min(100, Math.round((toplamKatki / maliyet) * 100)) : 0}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${maliyet > 0 ? Math.min(100, (toplamKatki / maliyet) * 100) : 0}%`,
                    background: toplamKatki >= maliyet
                      ? 'linear-gradient(90deg, #059669, #34d399)'
                      : 'linear-gradient(90deg, #ef4444, #f87171)',
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Hedef Maliyet</span>
                <span className="text-slate-200 font-semibold">{tlBicimlendir(maliyet)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Karşılanabilir Kolon</span>
                <span style={{ color: '#818cf8', fontWeight: 700 }}>{sayiFormat(karsilanabilirKolon)}</span>
              </div>
            </div>

            {eksikTL > 0 && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} color="#f87171" />
                <span style={{ fontSize: 12, color: '#f87171' }}>
                  Hedef için {tlBicimlendir(eksikTL)} daha gerekli
                </span>
              </div>
            )}
            {fazlaTL > 0 && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle size={14} color="#10b981" />
                <span style={{ fontSize: 12, color: '#34d399' }}>
                  Kasa tamamlandı! {tlBicimlendir(fazlaTL)} fazla var.
                </span>
              </div>
            )}
          </div>

          {/* Kazanç Dağılımı */}
          {kasaUyeleri.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <BarChart3 size={15} color="#818cf8" />
                Kazanç Dağılım Simülatörü
              </h3>

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-300 mb-2 block">
                  Net İkramiye (₺)
                </label>
                <input
                  type="number"
                  className="input-dark"
                  value={ikramiye}
                  onChange={(e) => setIkramiye(Number(e.target.value))}
                  placeholder="Net ikramiye tutarı"
                />
              </div>

              <div className="space-y-2">
                {dagilim.map((item) => (
                  <div
                    key={item.uyeId}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                      background: 'rgba(15, 22, 41, 0.6)',
                      border: '1px solid rgba(99,102,241,0.1)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#818cf8',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600 }}>
                        {item.uyeAd}
                      </span>
                    </div>
                    <div className="text-right">
                      <div style={{ color: '#34d399', fontWeight: 800, fontSize: 14 }}>
                        {tlBicimlendir(item.netKazanc)}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 11 }}>
                        %{(item.payOrani * 100).toFixed(1)} pay
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 p-3 rounded-xl text-center"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}
              >
                <div className="text-xs text-slate-400">Toplam Dağıtılan</div>
                <div style={{ color: '#818cf8', fontWeight: 900, fontSize: 18 }}>
                  {tlBicimlendir(ikramiye)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

