'use client';
import { useKuponStore } from '@/store/kupon-store';
import type { MacSecim, MacTipi } from '@/lib/kombinasyon';
import { kombinasyonUret } from '@/lib/kombinasyon';
import { tumFormullerKarsilastir, formuluUygula } from '@/lib/formuller';
import { filtrele } from '@/lib/filtreler';
import { tlBicimlendir } from '@/lib/vergi';
import { sayiFormat } from '@/lib/utils';
import { macAnaliziGetir, aiKuponOlustur, type SihirbazStratejisi } from '@/lib/ai-tahmin';
import KolonOnizlemeModal from '@/components/KolonOnizlemeModal';
import AiSihirbaz from '@/components/AiSihirbaz';
import AuthModal from '@/components/AuthModal';
import TopluBultenModal from '@/components/TopluBultenModal';
import {
  Trophy, TrendingDown, Zap, Info, CheckCircle,
  AlertCircle, Star, ArrowRight, Download, Share2, Sparkles, Cloud, Edit3, ClipboardList
} from 'lucide-react';
import { GUNCEL_LISTE } from '@/store/kupon-store';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

type MacSecimOption = '1' | 'X' | '2';

export default function KuponSayfasi() {
  const {
    maclar,
    setMaclar,
    kolonSayisi,
    maliyet,
    aktifFormul,
    setAktifFormul,
    filtreler,
    filtreAktif,
    macSecimGuncelle,
    macTipiGuncelle,
    takimGuncelle,
  } = useKuponStore();

  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [modalAcik, setModalAcik] = useState(false);
  const [bultenModalAcik, setBultenModalAcik] = useState(false);
  const [authModalAcik, setAuthModalAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const formuller = tumFormullerKarsilastir(kolonSayisi);

  // Gerçek kolan sayısı hesapları
  const bankoSayisi = maclar.filter((m) => m.tip === 'banko').length;
  const ciftSayisi = maclar.filter((m) => m.tip === 'cift').length;
  const tekSayisi = maclar.filter((m) => m.tip === 'tek').length;

  // Aktif formüle göre gerçek maliyet
  const aktifFormulSonuc = aktifFormul
    ? formuller.find((f) => f.tip === aktifFormul)
    : null;
  const gosterilecekMaliyet = aktifFormulSonuc?.formulMaliyet ?? maliyet;
  const gosterilecekKolonSayisi = aktifFormulSonuc?.formulKolonSayisi ?? kolonSayisi;

  // Üretilen nihai kolonlar (Modal ve Export için)
  const uretilenKolonlar = useMemo(() => {
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

  // Buluta Kaydet
  const bulutaKaydet = async () => {
    setKaydediliyor(true);
    try {
      const res = await fetch('/api/kuponlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Spor Toto ${GUNCEL_LISTE.hafta}. Hafta Kuponu`,
          hafta: GUNCEL_LISTE.hafta,
          maclar,
          secilenKolonlar: uretilenKolonlar.slice(0, 100),
          aktifFormul,
          toplamKolon: gosterilecekKolonSayisi,
          maliyet: gosterilecekMaliyet,
        }),
      });

      if (res.status === 401) {
        toast.error('Kupon kaydetmek için lütfen giriş yapın');
        setAuthModalAcik(true);
        setKaydediliyor(false);
        return;
      }

      if (res.ok) {
        toast.success('Kupon buluta başarıyla kaydedildi!');
      } else {
        toast.error('Kupon kaydedilemedi');
      }
    } catch {
      toast.error('Bağlantı hatası oluştu');
    } finally {
      setKaydediliyor(false);
    }
  };

  // AI Stratejisi uygulama
  const handleStratejiUygula = (strateji: SihirbazStratejisi) => {
    const yeniMaclar = aiKuponOlustur(maclar, strateji);
    setMaclar(yeniMaclar);
  };

  // WhatsApp Paylaşımı
  const whatsappPaylas = () => {
    const metin = `⚽ Spor Toto AI ile Kuponum Hazır!\n\n` +
      `📌 ${GUNCEL_LISTE.hafta}. Hafta Listesi\n` +
      `📊 Kolon Sayısı: ${sayiFormat(gosterilecekKolonSayisi)} Adet\n` +
      `💰 Toplam Maliyet: ${tlBicimlendir(gosterilecekMaliyet)}\n` +
      `${aktifFormul ? `⭐ Formül: ${aktifFormul}\n` : ''}` +
      `\n🔗 Hemen inceleyin: ${window.location.origin}/kupon`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(metin)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* AI Akıllı Sihirbaz */}
      <AiSihirbaz onStratejiUygula={handleStratejiUygula} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ===== SOL: MAÇLAR ===== */}
        <div className="lg:col-span-2 space-y-3">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-100">Kupon Oluşturucu</h1>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    color: '#818cf8',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                  }}
                >
                  {GUNCEL_LISTE.hafta}. HAFTA
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {GUNCEL_LISTE.tarihAralik} · sportoto.gov.tr'den alındı
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
                onClick={() => setBultenModalAcik(true)}
              >
                <ClipboardList size={14} color="#818cf8" />
                Bülteni Yapıştır / Düzenle
              </button>
              <button
                className="btn-secondary text-xs py-2 px-3"
                onClick={() => setDuzenlemeModu(!duzenlemeModu)}
              >
                {duzenlemeModu ? 'Bitti' : 'İsimleri Değiştir'}
              </button>
            </div>
          </div>

          {/* Maç Kartları */}
          {maclar.map((mac, idx) => {
            const analiz = macAnaliziGetir(mac);

            return (
              <div
                key={mac.id}
                className={`mac-kart p-4 ${mac.tip}`}
              >
                <div className="flex items-center gap-3">
                  {/* Maç No */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: mac.tip === 'banko'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(99, 102, 241, 0.1)',
                      color: mac.tip === 'banko' ? '#f59e0b' : '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* Takım Adı & AI İstatistikleri */}
                  {duzenlemeModu ? (
                    <div className="flex gap-1 flex-1 min-w-0">
                      <input
                        className="input-dark text-xs"
                        value={mac.takim1}
                        onChange={(e) => takimGuncelle(mac.id, e.target.value, mac.takim2)}
                        placeholder="Ev sahibi"
                      />
                      <input
                        className="input-dark text-xs"
                        value={mac.takim2}
                        onChange={(e) => takimGuncelle(mac.id, mac.takim1, e.target.value)}
                        placeholder="Deplasman"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-200 truncate flex items-center gap-1.5">
                        <span>{mac.takim1}</span>
                        <span className="text-slate-500 text-xs">vs</span>
                        <span>{mac.takim2}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {mac.lig && (
                          <span
                            style={{
                              color: '#94a3b8',
                              fontSize: 10,
                              fontWeight: 700,
                              background: 'rgba(99,102,241,0.08)',
                              padding: '1px 5px',
                              borderRadius: 4,
                            }}
                          >
                            {mac.lig}
                          </span>
                        )}

                        {/* AI Tahmin Olasılıkları */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span className={analiz.olasilik1 >= 45 ? 'text-sky-400 font-bold' : ''}>1: %{analiz.olasilik1}</span>
                          <span>·</span>
                          <span className={analiz.olasilikX >= 30 ? 'text-amber-400 font-bold' : ''}>X: %{analiz.olasilikX}</span>
                          <span>·</span>
                          <span className={analiz.olasilik2 >= 40 ? 'text-rose-400 font-bold' : ''}>2: %{analiz.olasilik2}</span>
                        </div>

                        {/* AI Öneri Rozeti */}
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                          }}
                        >
                          AI: {analiz.aiOneri.join('-')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tip Seçici */}
                  <div className="flex gap-1 flex-shrink-0">
                    {(['banko', 'tek', 'cift'] as MacTipi[]).map((tip) => (
                      <button
                        key={tip}
                        onClick={() => macTipiGuncelle(mac.id, tip)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          border: '1px solid',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          background: mac.tip === tip
                            ? tip === 'banko' ? 'rgba(245, 158, 11, 0.2)'
                              : tip === 'tek' ? 'rgba(99, 102, 241, 0.2)'
                              : 'rgba(16, 185, 129, 0.15)'
                            : 'transparent',
                          borderColor: mac.tip === tip
                            ? tip === 'banko' ? '#f59e0b'
                              : tip === 'tek' ? '#6366f1'
                              : '#10b981'
                            : 'rgba(99, 102, 241, 0.15)',
                          color: mac.tip === tip
                            ? tip === 'banko' ? '#fbbf24'
                              : tip === 'tek' ? '#818cf8'
                              : '#34d399'
                            : '#64748b',
                        }}
                      >
                        {tip === 'banko' ? '★' : tip === 'tek' ? 'TEK' : 'ÇFT'}
                      </button>
                    ))}
                  </div>

                  {/* 1 / X / 2 Seçimleri */}
                  <div className="flex gap-1 flex-shrink-0">
                    {(['1', 'X', '2'] as MacSecimOption[]).map((secim) => {
                      const aktif = mac.secimler.includes(secim);
                      return (
                        <button
                          key={secim}
                          onClick={() => macSecimGuncelle(mac.id, secim as MacSecim, !aktif)}
                          className={`secim-btn ${aktif ? `aktif-${secim}` : ''}`}
                        >
                          {secim}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Filtre Sayfasına Yönlendirme */}
          <div
            className="card p-4 flex items-center justify-between"
            style={{ borderColor: 'rgba(99, 102, 241, 0.2)', marginTop: 8 }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingDown size={18} color="#818cf8" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200">Filtreler ile Daha Fazla Düşür</div>
                <div className="text-xs text-slate-400">15 filtre ile israf kolonları eleyerek 10 TL/kolon tasarruf et</div>
              </div>
            </div>
            <Link href="/filtreler">
              <button className="btn-secondary text-sm flex items-center gap-1">
                Filtrelere Git <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </div>

        {/* ===== SAĞ: MALİYET PANELİ ===== */}
        <div className="space-y-4">
          {/* Anlık Maliyet Göstergesi */}
          <div
            className="glass-card p-6"
            style={{ position: 'sticky', top: 80 }}
          >
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Anlık Maliyet
            </div>

            {/* Ana Maliyet */}
            <div className="text-center mb-6">
              <div
                className="price-update"
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: gosterilecekMaliyet > 10000 ? '#f87171' :
                    gosterilecekMaliyet > 2000 ? '#f59e0b' : '#34d399',
                  lineHeight: 1,
                }}
              >
                {tlBicimlendir(gosterilecekMaliyet)}
              </div>
              <div className="text-slate-400 text-sm mt-2">
                {sayiFormat(gosterilecekKolonSayisi)} Kolon × 10 ₺
              </div>
            </div>

            {/* Kolonları Gör & Dışa Aktar Butonları */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setModalAcik(true)}
                className="btn-primary flex items-center justify-center gap-2 text-xs py-3"
              >
                <Download size={14} />
                Kolonları Gör
              </button>

              <button
                onClick={whatsappPaylas}
                className="btn-secondary flex items-center justify-center gap-2 text-xs py-3"
              >
                <Share2 size={14} color="#22c55e" />
                WhatsApp'ta Paylaş
              </button>
            </div>

            {/* Buluta Kaydet Butonu */}
            <button
              onClick={bulutaKaydet}
              disabled={kaydediliyor}
              className="btn-success w-full py-3 text-xs flex items-center justify-center gap-2 mb-6"
            >
              <Cloud size={14} />
              {kaydediliyor ? 'Kaydediliyor...' : 'Kuponu Buluta Kaydet'}
            </button>

            {/* Özet */}
            <div className="space-y-2 mb-6">
              {[
                { label: 'Banko', deger: bankoSayisi, renk: '#f59e0b' },
                { label: 'Tek Geçilen', deger: tekSayisi, renk: '#818cf8' },
                { label: 'Çifte Geçilen', deger: ciftSayisi, renk: '#10b981' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span style={{ color: item.renk, fontWeight: 700, fontSize: 14 }}>
                    {item.deger} Maç
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* Formül Seçici */}
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Garantili Formül Seç
            </div>

            <div className="space-y-2">
              {formuller.map((f) => {
                const aktif = aktifFormul === f.tip;
                const tasarrufYuzde = kolonSayisi > 0
                  ? Math.round(((kolonSayisi - f.formulKolonSayisi) / kolonSayisi) * 100)
                  : 0;

                return (
                  <button
                    key={f.tip}
                    onClick={() => {
                      setAktifFormul(aktif ? null : f.tip);
                      if (!aktif) toast.success(`${f.tip} aktif — %${tasarrufYuzde} tasarruf!`);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      background: aktif
                        ? f.tip === '15-garantili' ? 'rgba(16, 185, 129, 0.1)'
                          : f.tip === '14-garantili' ? 'rgba(245, 158, 11, 0.1)'
                          : f.tip === '13-garantili' ? 'rgba(99, 102, 241, 0.1)'
                          : 'rgba(6, 182, 212, 0.1)'
                        : 'rgba(15, 22, 41, 0.5)',
                      borderColor: aktif
                        ? f.tip === '15-garantili' ? '#10b981'
                          : f.tip === '14-garantili' ? '#f59e0b'
                          : f.tip === '13-garantili' ? '#6366f1'
                          : '#06b6d4'
                        : 'rgba(99, 102, 241, 0.15)',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: aktif ? '#f1f5f9' : '#94a3b8',
                          }}
                        >
                          {formulEtiket(f.tip)}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {sayiFormat(f.formulKolonSayisi)} kolon
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: f.tip === '15-garantili' ? '#10b981'
                              : f.tip === '14-garantili' ? '#f59e0b'
                              : f.tip === '13-garantili' ? '#818cf8'
                              : '#22d3ee',
                          }}
                        >
                          {tlBicimlendir(f.formulMaliyet)}
                        </div>
                        {f.dususOrani > 1 && (
                          <div style={{ fontSize: 10, color: '#10b981' }}>
                            {f.dususOrani}× düşük
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tasarruf göstergesi */}
            {aktifFormulSonuc && aktifFormulSonuc.tasarruf > 0 && (
              <div
                className="mt-4 p-3 rounded-xl"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} color="#10b981" />
                  <div>
                    <div style={{ color: '#34d399', fontWeight: 700, fontSize: 14 }}>
                      {tlBicimlendir(aktifFormulSonuc.tasarruf)} Tasarruf!
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>
                      {aktifFormulSonuc.garanti}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kolon Önizleme & Export Modalı */}
      <KolonOnizlemeModal
        acik={modalAcik}
        onKapat={() => setModalAcik(false)}
        kolonlar={uretilenKolonlar}
        maclar={maclar}
        baslik={`35. Hafta Üretilen Kolonlar (${uretilenKolonlar.length} Adet)`}
      />

      {/* Giriş / Kayıt Modalı */}
      <AuthModal
        acik={authModalAcik}
        onKapat={() => setAuthModalAcik(false)}
      />

      {/* Toplu Bülten Yapıştır Modalı */}
      <TopluBultenModal
        acik={bultenModalAcik}
        onKapat={() => setBultenModalAcik(false)}
        mevcutMaclar={maclar}
        onGuncelle={(yeni) => setMaclar(yeni)}
      />
    </div>
  );
}

function formulEtiket(tip: string): string {
  const etiketler: Record<string, string> = {
    '15-garantili': '⭐ 15 Garantili (Tam Liste)',
    '14-garantili': '🥇 14 Garantili (%100)',
    '13-garantili': '🥈 13 Garantili (%100)',
    '12-garantili': '🥉 12 Garantili (%100)',
  };
  return etiketler[tip] ?? tip;
}
