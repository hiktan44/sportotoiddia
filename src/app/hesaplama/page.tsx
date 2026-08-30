'use client';
import { useState } from 'react';
import { vergiHesapla, tlBicimlendir, VERGI_PARAMETRELERI } from '@/lib/vergi';
import { sayiFormat } from '@/lib/utils';
import { Calculator, Shield, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function HesaplamaSayfasi() {
  const [havuz, setHavuz] = useState(10_000_000);   // 10M TL örnek
  const [galibiKolonSayisi, setGalibi] = useState(3);
  const [toplamKolon, setToplamKolon] = useState(1000);

  const sonuc = vergiHesapla(havuz, galibiKolonSayisi, toplamKolon);
  const { kdvOrani, sovOrani, verasetOrani, muafiyetSiniri, kdvYuzde, sovYuzde, verasetYuzde } = VERGI_PARAMETRELERI;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 badge badge-green mb-4">
          <Shield size={12} />
          Büyük Vergi Avantajı Hesaplayıcı
        </div>
        <h1 className="text-4xl font-black text-slate-100 mb-3">
          İkramiye & <span className="gradient-text">Vergi Hesaplama</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          10 TL bağımsız kolon sisteminin, tek büyük barkod kupona kıyasla
          sağladığı vergi avantajını tam olarak hesaplayın.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* ===== GİRİŞ FORMU ===== */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
            <Calculator size={18} color="#818cf8" />
            Parametreler
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                İkramiye Havuzu (₺)
              </label>
              <input
                type="number"
                className="input-dark text-lg font-bold"
                value={havuz}
                onChange={(e) => setHavuz(Number(e.target.value))}
                placeholder="10000000"
              />
              <div className="text-xs text-slate-500 mt-1">
                Ör: 10.000.000 = {tlBicimlendir(havuz)} havuz
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Kazanan Kolon Sayısı
              </label>
              <input
                type="number"
                className="input-dark"
                value={galibiKolonSayisi}
                onChange={(e) => setGalibi(Math.max(1, Number(e.target.value)))}
                min={1}
              />
              <div className="text-xs text-slate-500 mt-1">
                Her biri 10 TL&apos;lik bağımsız kazanan kolon
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Toplam Oynanmış Kolon
              </label>
              <input
                type="number"
                className="input-dark"
                value={toplamKolon}
                onChange={(e) => setToplamKolon(Math.max(1, Number(e.target.value)))}
                min={1}
              />
            </div>
          </div>

          {/* Vergi Oranları Bilgisi */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Yasal Vergi Oranları
            </div>
            {[
              { label: 'KDV (havuzdan)', deger: `%${kdvYuzde}` },
              { label: 'Şans Oyunları Vergisi', deger: `%${sovYuzde}` },
              { label: 'Veraset ve İntikal Vergisi', deger: `%${verasetYuzde}` },
              { label: '2025 Muafiyet Sınırı', deger: tlBicimlendir(muafiyetSiniri) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-xs py-1.5" style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-200 font-semibold">{item.deger}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== KARŞILAŞTIRMA SONUCU ===== */}
        <div className="space-y-4">
          {/* Büyük Kupon */}
          <div className="card p-5" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} color="#ef4444" />
              <h3 className="text-sm font-bold text-slate-200">❌ Tek Büyük Barkod Kuponu</h3>
            </div>
            <div className="space-y-2 text-sm">
              <SatirItem label="Brüt İkramiye" deger={tlBicimlendir(sonuc.buyukKuponBrutIkramiye)} />
              <SatirItem label={`KDV Kesintisi (%${kdvYuzde})`} deger={`-${tlBicimlendir(sonuc.buyukKuponBrutIkramiye * kdvOrani)}`} renk="#f87171" />
              <SatirItem label={`ŞOV Kesintisi (%${sovYuzde})`} deger={`-${tlBicimlendir(sonuc.buyukKuponKDVSonrasi * sovOrani)}`} renk="#f87171" />
              <SatirItem label="Veraset Vergisi" deger={`-${tlBicimlendir(sonuc.buyukKuponVeraset)}`} renk="#f87171" />
              <div className="divider" />
              <div className="flex justify-between">
                <span className="text-slate-300 font-bold">NET KAZANINÇ</span>
                <span style={{ color: '#f87171', fontWeight: 900, fontSize: 18 }}>
                  {tlBicimlendir(sonuc.buyukKuponNetGelir)}
                </span>
              </div>
            </div>
          </div>

          {/* Bağımsız Kolonlar */}
          <div className="card p-5" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} color="#10b981" />
              <h3 className="text-sm font-bold text-slate-200">✅ Bağımsız 10 TL Kolonlar</h3>
            </div>
            <div className="space-y-2 text-sm">
              <SatirItem label="Kazanan Kolon Sayısı" deger={sayiFormat(sonuc.bagimsizKolonSayisi)} />
              <SatirItem label="Muafiyet Dahilindeki" deger={sayiFormat(sonuc.bagimsizMuafKolonSayisi)} renk="#34d399" />
              <SatirItem label="Vergi Ödeyen Kolon" deger={sayiFormat(sonuc.bagimsizVergiKolonSayisi)} />
              <div className="divider" />
              <div className="flex justify-between">
                <span className="text-slate-300 font-bold">NET KAZANINÇ</span>
                <span style={{ color: '#34d399', fontWeight: 900, fontSize: 18 }}>
                  {tlBicimlendir(sonuc.bagimsizNetGelir)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FARK KUTUSU ===== */}
      <div
        className="glass-card p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <TrendingUp size={24} color="#10b981" />
          <h2 className="text-2xl font-black text-slate-100">
            Bağımsız Kolon Sistemi ile Fazladan Kazanç
          </h2>
        </div>

        <div style={{ fontSize: 56, fontWeight: 900, color: '#34d399', lineHeight: 1 }} className="my-4">
          {tlBicimlendir(Math.max(0, sonuc.kazanc))}
        </div>

        <div style={{ fontSize: 18, color: '#10b981', fontWeight: 700 }}>
          %{Math.max(0, sonuc.kazancYuzdesi).toFixed(1)} daha fazla net gelir
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 text-sm text-slate-400">
          <div>
            <span style={{ color: '#f87171', fontWeight: 700 }}>Tek Barkod: </span>
            {tlBicimlendir(sonuc.buyukKuponNetGelir)}
          </div>
          <div className="hidden sm:block">→</div>
          <div>
            <span style={{ color: '#34d399', fontWeight: 700 }}>Bağımsız Kolon: </span>
            {tlBicimlendir(sonuc.bagimsizNetGelir)}
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl inline-flex items-start gap-2 text-left" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Info size={13} color="#818cf8" style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: '#94a3b8', maxWidth: 400 }}>
            Her 10 TL&apos;lik bağımsız kolon {tlBicimlendir(muafiyetSiniri)} muafiyet sınırından ayrı ayrı yararlanır.
            Büyük ikramiyelerde bu fark inanılmaz boyutlara ulaşabilir.
          </div>
        </div>
      </div>
    </div>
  );
}

function SatirItem({
  label, deger, renk = '#94a3b8'
}: {
  label: string; deger: string; renk?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color: renk, fontWeight: 600 }}>{deger}</span>
    </div>
  );
}
