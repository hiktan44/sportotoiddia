'use client';
import { useState, useMemo, useEffect } from 'react';
import { useKuponStore } from '@/store/kupon-store';
import { kombinasyonUret, type MacSecim } from '@/lib/kombinasyon';
import { formuluUygula, hammingMesafesi } from '@/lib/formuller';
import { filtrele } from '@/lib/filtreler';
import { tlBicimlendir } from '@/lib/vergi';
import { Trophy, Activity, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CanliTakipSayfasi() {
  const { maclar, aktifFormul, filtreler, filtreAktif } = useKuponStore();

  // Her maç için girilen canlı/biten sonuç
  const [canliSonuclar, setCanliSonuclar] = useState<Record<number, MacSecim | null>>({});
  const [canliDetaylar, setCanliDetaylar] = useState<any[]>([]);
  const [sonGuncelleme, setSonGuncelleme] = useState<string>('');
  const [yukleniyor, setYukleniyor] = useState(false);

  // Canlı skorları API'den otomatik çek
  const canliSkorlariGetir = async (sessiz = false) => {
    if (!sessiz) setYukleniyor(true);
    try {
      const res = await fetch('/api/bulten-canli');
      const data = await res.json();
      if (data.maclar && Array.isArray(data.maclar)) {
        const yeniSonuclar: Record<number, MacSecim | null> = {};
        data.maclar.forEach((m: any) => {
          if (m.sonuc) yeniSonuclar[m.id] = m.sonuc as MacSecim;
        });
        setCanliSonuclar(yeniSonuclar);
        setCanliDetaylar(data.maclar);
        setSonGuncelleme(data.sonGuncelleme || new Date().toLocaleTimeString());
        if (!sessiz) toast.success(`⚡ iddaa.com canlı bülteni ve skorları senkronize edildi! (${data.sonGuncelleme})`);
      }
    } catch {
      if (!sessiz) toast.error('Canlı skorlar çekilemedi');
    } finally {
      if (!sessiz) setYukleniyor(false);
    }
  };

  // Sayfa açıldığında ve her 60 saniyede bir otomatik canlı çek
  useEffect(() => {
    canliSkorlariGetir(true);
    const interval = setInterval(() => canliSkorlariGetir(true), 60000);
    return () => clearInterval(interval);
  }, []);

  // Oynanan kolonları üret
  const oynananKolonlar = useMemo(() => {
    let kolonlar = kombinasyonUret(maclar);

    if (filtreAktif) {
      const bankoIdx = maclar.map((m, i) => m.tip === 'banko' ? i : -1).filter((i) => i !== -1);
      const favoriler = maclar.map((m) => m.secimler[0] || '1');
      kolonlar = filtrele(kolonlar, filtreler, bankoIdx, favoriler).kalan;
    }

    if (aktifFormul) {
      kolonlar = formuluUygula(kolonlar, aktifFormul);
    }

    return kolonlar;
  }, [maclar, aktifFormul, filtreler, filtreAktif]);

  // Manuel sonuç girme
  const sonucBelirle = (macId: number, sonuc: MacSecim) => {
    setCanliSonuclar((prev) => ({
      ...prev,
      [macId]: prev[macId] === sonuc ? null : sonuc,
    }));
  };

  const sonuclariSifirla = () => {
    setCanliSonuclar({});
    toast.success('Canlı sonuçlar sıfırlandı');
  };

  // Kolonların canlı başarı analizi
  const canliAnaliz = useMemo(() => {
    const oynananMacSayisi = Object.values(canliSonuclar).filter((v) => v !== null).length;
    const kalanMacSayisi = 15 - oynananMacSayisi;

    let canli15 = 0;
    let canli14 = 0;
    let canli13 = 0;
    let canli12 = 0;

    const kolonDetaylari = oynananKolonlar.map((kolon) => {
      let bilinen = 0;
      let yanlis = 0;

      kolon.tahminler.forEach((tahmin, idx) => {
        const gelen = canliSonuclar[idx + 1];
        if (gelen) {
          if (gelen === tahmin) bilinen++;
          else yanlis++;
        }
      });

      // Bu kolonun maksimum ulaşabileceği potansiyel doğru sayısı
      const maksPotansiyel = bilinen + kalanMacSayisi;

      if (maksPotansiyel >= 15) canli15++;
      if (maksPotansiyel >= 14) canli14++;
      if (maksPotansiyel >= 13) canli13++;
      if (maksPotansiyel >= 12) canli12++;

      return {
        id: kolon.id,
        tahminler: kolon.tahminler,
        bilinen,
        yanlis,
        maksPotansiyel,
      };
    });

    return {
      oynananMacSayisi,
      kalanMacSayisi,
      canli15,
      canli14,
      canli13,
      canli12,
      kolonDetaylari,
    };
  }, [oynananKolonlar, canliSonuclar]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 badge badge-brand mb-2">
            <Activity size={12} />
            Quinielista Tarzı Canlı Kupon Simülatörü
          </div>
          <h1 className="text-3xl font-black text-slate-100">
            Canlı <span className="gradient-text">Kupon Takip & İkramiye</span> Radarı
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maç sonuçları geldikçe kuponunuzdaki hangi kolonların 15, 14, 13 ve 12 yarışında kaldığını anlık izleyin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => canliSkorlariGetir(false)} className="btn-primary text-sm flex items-center gap-2">
            <RefreshCcw size={14} className={yukleniyor ? 'animate-spin' : ''} />
            {yukleniyor ? 'Çekiliyor...' : '⚡ Canlı Skorları Çek'}
          </button>
          <button onClick={sonuclariSifirla} className="btn-secondary text-sm flex items-center gap-2">
            Sonuçları Temizle
          </button>
        </div>
      </div>

      {/* İkramiye ve Durum Göstergesi */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '15 Bilen Potansiyeli', adet: canliAnaliz.canli15, renk: '#38bdf8', icon: Trophy, bg: 'rgba(56, 189, 248, 0.1)' },
          { label: '14 Bilen Potansiyeli', adet: canliAnaliz.canli14, renk: '#f59e0b', icon: Award, bg: 'rgba(245, 158, 11, 0.1)' },
          { label: '13 Bilen Potansiyeli', adet: canliAnaliz.canli13, renk: '#818cf8', icon: Sparkles, bg: 'rgba(129, 140, 248, 0.1)' },
          { label: '12 Bilen Potansiyeli', adet: canliAnaliz.canli12, renk: '#10b981', icon: CheckCircle2, bg: 'rgba(16, 185, 129, 0.1)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card p-5 text-center"
            style={{ borderColor: `${stat.renk}30`, background: stat.bg }}
          >
            <div className="flex items-center justify-center gap-2 mb-2" style={{ color: stat.renk }}>
              <stat.icon size={18} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc' }}>
              {stat.adet} <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Kolon</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SOL: Maç Skor Giriş Paneli */}
        <div className="lg:col-span-1 space-y-3">
          <div className="card p-4">
            <h2 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
              <span>Maç Sonuçlarını Girin</span>
              <span className="badge badge-brand text-xs">
                {canliAnaliz.oynananMacSayisi} / 15 Girildi
              </span>
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {maclar.map((mac, idx) => {
                const seciliSonuc = canliSonuclar[mac.id];
                return (
                  <div
                    key={mac.id}
                    className="p-2.5 rounded-xl flex items-center justify-between"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: seciliSonuc ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="text-xs font-semibold text-slate-300 truncate">
                        <span className="text-slate-500 mr-1.5">{idx + 1}.</span>
                        {mac.takim1} - {mac.takim2}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {(['1', 'X', '2'] as MacSecim[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => sonucBelirle(mac.id, s)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: '1px solid',
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            background: seciliSonuc === s ? '#6366f1' : 'rgba(30, 41, 59, 0.8)',
                            borderColor: seciliSonuc === s ? '#818cf8' : 'rgba(99, 102, 241, 0.2)',
                            color: seciliSonuc === s ? '#ffffff' : '#94a3b8',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SAĞ: Canlı Kolon Radarı */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-200">
                Kolonların Canlı Durumu ({oynananKolonlar.length} Kolon)
              </h2>
              <span className="text-xs text-slate-400">
                {canliAnaliz.kalanMacSayisi === 0 ? '🏆 BÜTÜN MAÇLAR BİTTİ' : `${canliAnaliz.kalanMacSayisi} Maç Kaldı`}
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {canliAnaliz.kolonDetaylari.map((kolon) => {
                const durumRenk =
                  kolon.maksPotansiyel === 15 ? '#38bdf8' :
                  kolon.maksPotansiyel === 14 ? '#f59e0b' :
                  kolon.maksPotansiyel === 13 ? '#818cf8' :
                  kolon.maksPotansiyel === 12 ? '#10b981' : '#64748b';

                return (
                  <div
                    key={kolon.id}
                    className="p-3 rounded-xl flex items-center justify-between gap-3"
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: `1px solid ${durumRenk}30`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                        #{kolon.id}
                      </span>

                      <div className="flex gap-1">
                        {kolon.tahminler.map((t, mIdx) => {
                          const gelen = canliSonuclar[mIdx + 1];
                          const dogruMu = gelen ? gelen === t : null;

                          return (
                            <span
                              key={mIdx}
                              style={{
                                width: 18,
                                height: 20,
                                borderRadius: 4,
                                textAlign: 'center',
                                lineHeight: '20px',
                                fontSize: 10,
                                fontWeight: 800,
                                background: dogruMu === true ? 'rgba(16, 185, 129, 0.25)' :
                                  dogruMu === false ? 'rgba(239, 68, 68, 0.25)' : 'rgba(30, 41, 59, 0.5)',
                                color: dogruMu === true ? '#34d399' :
                                  dogruMu === false ? '#f87171' : '#94a3b8',
                              }}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: durumRenk }}>
                          Maks. {kolon.maksPotansiyel} Doğru
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>
                          {kolon.bilinen} Tutan | {kolon.yanlis} Yatan
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
