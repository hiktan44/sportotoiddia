import Link from 'next/link';
import {
  Trophy, Shield, Zap, Calculator, Users, Filter,
  TrendingDown, CheckCircle, ArrowRight, Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* ===== HERO ===== */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 badge badge-brand mb-6">
          <Zap size={12} />
          Kolon Bedeli 10 TL — Platform Artık Zorunluluk
        </div>

        <h1
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Spor Toto&apos;da{' '}
          <span className="gradient-text">46.000 TL&apos;lik</span>
          <br />
          Kuponu{' '}
          <span className="gradient-text-gold">560 TL&apos;ye</span>
          <br />
          Düşür
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Matematiksel garantili formüller ve 15 akıllı filtre ile kolon maliyetinizi
          <strong className="text-slate-200"> 81 kata kadar</strong> düşürün.
          Her elenen kolon, cebinizde kalan{' '}
          <strong className="text-green-400">10 TL</strong>&apos;dir.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/kupon">
            <button className="btn-primary text-base px-8 py-4 flex items-center gap-2">
              <Trophy size={18} />
              Kupon Oluştur
              <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/hesaplama">
            <button className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
              <Calculator size={18} />
              Vergi Hesapla
            </button>
          </Link>
        </div>
      </section>

      {/* ===== MALİYET KARŞILAŞTIRMA ===== */}
      <section className="mb-20">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            <span className="gradient-text">Gerçek Maliyet Farkı</span>
          </h2>
          <p className="text-center text-slate-400 mb-8 text-sm">
            Örnek: 4 Banko + 2 Kapalı + 9 Çifte Kupon (4.608 Kolon)
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Düz Kupon', adet: '4.608', fiyat: '46.080 ₺', renk: '#ef4444', desc: 'Tam maliyet' },
              { label: '14 Garantili', adet: '512', fiyat: '5.120 ₺', renk: '#f59e0b', desc: '9× düşük' },
              { label: '13 Garantili', adet: '171', fiyat: '1.710 ₺', renk: '#818cf8', desc: '27× düşük' },
              { label: '12 Garantili', adet: '57', fiyat: '570 ₺', renk: '#10b981', desc: '81× düşük' },
            ].map((item) => (
              <div
                key={item.label}
                className="card p-5 text-center"
                style={{ borderColor: `${item.renk}30` }}
              >
                <div style={{ color: item.renk, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                  {item.desc.toUpperCase()}
                </div>
                <div style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 800, marginBottom: 2 }}>
                  {item.fiyat}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{item.adet} Kolon</div>
                <div style={{ color: item.renk, fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ÖZELLİKLER ===== */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Platform <span className="gradient-text">Özellikleri</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ozellikler.map((ozellik) => (
            <Link key={ozellik.baslik} href={ozellik.href} className="no-underline">
              <div
                className="card p-6 h-full cursor-pointer group"
                style={{ transition: 'all 0.2s ease' }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${ozellik.renk}15`,
                    border: `1px solid ${ozellik.renk}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <ozellik.Icon size={22} color={ozellik.renk} />
                </div>
                <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                  {ozellik.baslik}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                  {ozellik.aciklama}
                </p>
                <div
                  style={{
                    marginTop: 12,
                    color: ozellik.renk,
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Keşfet <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== VERGİ AVANTAJI ===== */}
      <section className="mb-20">
        <div
          className="glass-card p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
          }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Shield size={24} color="#10b981" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                10 TL Bağımsız Kolon = Büyük Vergi Avantajı
              </h2>
              <p className="text-slate-400 text-sm">
                Tek büyük barkod yerine ayrı kolonlarla muafiyet sınırından tam yararlanın
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {vergiMaddeleri.map((madde) => (
              <div
                key={madde.baslik}
                className="card p-5"
                style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}
              >
                <CheckCircle size={16} color="#10b981" style={{ marginBottom: 8 }} />
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {madde.baslik}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{madde.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {istatistikler.map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <div className="gradient-text" style={{ fontSize: 36, fontWeight: 900 }}>
                {stat.deger}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="text-center">
        <div
          className="glass-card p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
          }}
        >
          <Star size={32} color="#f59e0b" className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Hemen <span className="gradient-text">Başla</span>
          </h2>
          <p className="text-slate-400 mb-8">
            15 maçını gir, garantili formülünü seç, filtrelerini belirle.
            <br />
            Sistematik ve akıllı oynama devri şimdi başlıyor.
          </p>
          <Link href="/kupon">
            <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
              <Trophy size={18} />
              Kupon Oluşturmaya Başla
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const ozellikler = [
  {
    baslik: 'Kupon Oluşturucu & AI Sihirbaz',
    aciklama: 'xG ve Poisson olasılıkları ile 15 maçı tek tıkla doldurun. Banko ve çifte seçenekleriyle anlık hesaplama.',
    Icon: Trophy,
    renk: '#f59e0b',
    href: '/kupon',
  },
  {
    baslik: '15 Akıllı Filtre',
    aciklama: 'Ters sürpriz, beraberlik limiti, art arda engeli, özel grup filtresi — her elenen kolon 10 TL tasarruf.',
    Icon: Filter,
    renk: '#6366f1',
    href: '/filtreler',
  },
  {
    baslik: 'Canlı Kupon Takip Radarı',
    aciklama: 'Maçlar oynandıkça 15, 14, 13 ve 12 yarışında kalan kolonlarınızı canlı olarak anlık takip edin.',
    Icon: Zap,
    renk: '#38bdf8',
    href: '/canli-takip',
  },
  {
    baslik: 'Vergi & İkramiye Hesap',
    aciklama: 'Bağımsız 10 TL kolonlarla elde ettiğin net vergi avantajını hesapla. Muafiyet sınırı tam analizi.',
    Icon: Calculator,
    renk: '#10b981',
    href: '/hesaplama',
  },
  {
    baslik: 'Ortak Kasa Modülü',
    aciklama: 'Birden fazla oyuncu bütçelerini birleştirerek devasa kasalar oluşturabilir. Kazanç payı otomatik hesaplanır.',
    Icon: Users,
    renk: '#f43f5e',
    href: '/ortak-kupon',
  },
  {
    baslik: 'Excel & TXT Dışa Aktarma',
    aciklama: 'Üretilen tüm indirgenmiş ve filtrelenmiş kolonları tek tıkla Excel, TXT veya panoya kopyalayın.',
    Icon: Shield,
    renk: '#8b5cf6',
    href: '/kupon',
  },
];

const vergiMaddeleri = [
  {
    baslik: 'Her Kolon Ayrı Muafiyet',
    aciklama: '2025 yılı 53.339 TL muafiyet sınırı her bağımsız kolon için ayrı ayrı uygulanır.',
  },
  {
    baslik: '%20 Veraset Vergisinden Kaçış',
    aciklama: 'Tek büyük barkod yerine küçük kolonlar, yüksek vergi diliminden korur.',
  },
  {
    baslik: 'Net Kazanç Farkı',
    aciklama: 'Büyük ikramiyelerde bağımsız kolon yöntemi ile net kazancın nasıl katlandığını tam hesapla.',
  },
];

const istatistikler = [
  { deger: '81×', label: '12 Garantili Maliyet Düşümü' },
  { deger: '15', label: 'Akıllı Filtre Seçeneği' },
  { deger: '10 TL', label: 'Kolon Başı Tasarruf Potansiyeli' },
  { deger: '%100', label: '15 Garantili Filtreli Sistem' },
];
