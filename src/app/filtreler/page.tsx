'use client';
import { useKuponStore } from '@/store/kupon-store';
import type { FiltreAyarlari } from '@/lib/filtreler';
import { aktifFiltreAdet, filtreDetayliAnaliz } from '@/lib/filtreler';
import { kombinasyonUret } from '@/lib/kombinasyon';
import { tlBicimlendir } from '@/lib/vergi';
import { sayiFormat } from '@/lib/utils';
import KolonOnizlemeModal from '@/components/KolonOnizlemeModal';
import {
  Filter, TrendingDown, RefreshCcw,
  Info, ChevronDown, ChevronUp, Shield, Download, CheckCircle2, Flame
} from 'lucide-react';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

export default function FiltrelerSayfasi() {
  const { filtreler, filtreGuncelle, filtreleriSifirla, kolonSayisi, maclar } = useKuponStore();
  const [acikGruplar, setAcikGruplar] = useState({ g1: true, g2: true, g3: true, g4: true });
  const [modalAcik, setModalAcik] = useState(false);

  const aktifSayi = aktifFiltreAdet(filtreler);

  // Gerçek zamanlı filtreleme ve kırılım analizi
  const filtreSonuc = useMemo(() => {
    // Performans için ham kombinasyonları al (veya max 5000)
    const hamKolonlar = kombinasyonUret(maclar);
    const bankoIdx = maclar.map((m, i) => m.tip === 'banko' ? i : -1).filter((i) => i !== -1);
    const favoriler = maclar.map((m) => m.secimler[0] || '1');

    return filtreDetayliAnaliz(hamKolonlar, filtreler, bankoIdx, favoriler);
  }, [maclar, filtreler]);

  const toggleGrup = (grup: 'g1' | 'g2' | 'g3' | 'g4') => {
    setAcikGruplar((prev) => ({ ...prev, [grup]: !prev[grup] }));
  };

  const sayisalFiltreGuncelle = (alan: keyof FiltreAyarlari, deger: string) => {
    const sayi = deger === '' ? null : parseInt(deger);
    filtreGuncelle(alan, sayi as FiltreAyarlari[typeof alan]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ===== SOL: FİLTRELER ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Filter size={22} color="#818cf8" />
                15 Akıllı Filtre Paneli
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Her elenen kolon = <span style={{ color: '#10b981', fontWeight: 700 }}>10 TL net tasarruf</span>
              </p>
            </div>
            {aktifSayi > 0 && (
              <button
                className="btn-danger flex items-center gap-1"
                onClick={() => {
                  filtreleriSifirla();
                  toast.success('Tüm filtreler sıfırlandı');
                }}
              >
                <RefreshCcw size={13} />
                Sıfırla ({aktifSayi})
              </button>
            )}
          </div>

          {/* GRUP 1: Sürpriz ve Beraberlik */}
          <GrupKart
            baslik="Sürpriz ve Beraberlik Filtreleri"
            renk="#818cf8"
            acik={acikGruplar.g1}
            toggle={() => toggleGrup('g1')}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FiltreItem
                label="Ters Sürpriz Maksimum"
                aciklama="Favori 1 iken 2, favori 2 iken 1 gelmesi. Beraberlik ters sürpriz sayılmaz."
              >
                <NumberInput
                  deger={filtreler.tersSurprizMax}
                  onChange={(v) => sayisalFiltreGuncelle('tersSurprizMax', v)}
                  min={0}
                  max={15}
                  yer="Maks. sayı (örn. 3)"
                />
              </FiltreItem>

              <FiltreItem
                label="Beraberlik (X) Sayısı"
                aciklama="Kuponda beklenen toplam X sayısını sınırla"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Az</label>
                    <NumberInput
                      deger={filtreler.beraberlikMin}
                      onChange={(v) => sayisalFiltreGuncelle('beraberlikMin', v)}
                      min={0}
                      max={15}
                      yer="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Fazla</label>
                    <NumberInput
                      deger={filtreler.beraberlikMax}
                      onChange={(v) => sayisalFiltreGuncelle('beraberlikMax', v)}
                      min={0}
                      max={15}
                      yer="Max"
                    />
                  </div>
                </div>
              </FiltreItem>

              <FiltreItem
                label="Toplam Sürpriz Sayısı"
                aciklama="15 maçta genelde 6-9 sürpriz idealdir. Bu aralığı belirle."
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Az</label>
                    <NumberInput
                      deger={filtreler.toplamSurprizMin}
                      onChange={(v) => sayisalFiltreGuncelle('toplamSurprizMin', v)}
                      min={0}
                      max={15}
                      yer="Min (örn. 4)"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Fazla</label>
                    <NumberInput
                      deger={filtreler.toplamSurprizMax}
                      onChange={(v) => sayisalFiltreGuncelle('toplamSurprizMax', v)}
                      min={0}
                      max={15}
                      yer="Max (örn. 9)"
                    />
                  </div>
                </div>
              </FiltreItem>
            </div>
          </GrupKart>

          {/* GRUP 2: 1'ler ve 2'ler */}
          <GrupKart
            baslik="1'ler ve 2'lerin Sayısı"
            renk="#10b981"
            acik={acikGruplar.g2}
            toggle={() => toggleGrup('g2')}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FiltreItem
                label="Ev Sahibi (1) Galibiyeti"
                aciklama="Toplam 1 sayısını sınırla"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Az</label>
                    <NumberInput deger={filtreler.birlerMin} onChange={(v) => sayisalFiltreGuncelle('birlerMin', v)} min={0} max={15} yer="Min" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Fazla</label>
                    <NumberInput deger={filtreler.birlerMax} onChange={(v) => sayisalFiltreGuncelle('birlerMax', v)} min={0} max={15} yer="Max" />
                  </div>
                </div>
              </FiltreItem>

              <FiltreItem
                label="Deplasman (2) Galibiyeti"
                aciklama="Toplam 2 sayısını sınırla"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Az</label>
                    <NumberInput deger={filtreler.ikilerMin} onChange={(v) => sayisalFiltreGuncelle('ikilerMin', v)} min={0} max={15} yer="Min" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">En Fazla</label>
                    <NumberInput deger={filtreler.ikilerMax} onChange={(v) => sayisalFiltreGuncelle('ikilerMax', v)} min={0} max={15} yer="Max" />
                  </div>
                </div>
              </FiltreItem>
            </div>
          </GrupKart>

          {/* GRUP 3: Art Arda */}
          <GrupKart
            baslik="Art Arda Sonuç Filtreleri"
            renk="#f59e0b"
            acik={acikGruplar.g3}
            toggle={() => toggleGrup('g3')}
          >
            <div
              className="p-3 rounded-xl mb-4"
              style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <div className="flex items-start gap-2">
                <Shield size={14} color="#f59e0b" style={{ marginTop: 1 }} />
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  <strong style={{ color: '#fbbf24' }}>Kural:</strong> Banko olarak işaretlenen maçlar art arda filtresine takılmaz ve elenemez.
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { alan: 'artArdaBirMax' as keyof FiltreAyarlari, label: 'Max Art Arda 1', aciklama: 'Arka arkaya gelebilecek max ev galibiyeti' },
                { alan: 'artArdaIkiMax' as keyof FiltreAyarlari, label: 'Max Art Arda 2', aciklama: 'Arka arkaya gelebilecek max deplasman galibiyeti' },
                { alan: 'artArdaXMax' as keyof FiltreAyarlari, label: 'Max Art Arda X', aciklama: 'Arka arkaya gelebilecek max beraberlik' },
                { alan: 'artArdaBirXMax' as keyof FiltreAyarlari, label: 'Max Art Arda 1-X', aciklama: 'Arka arkaya 1 veya X gelme limiti' },
                { alan: 'artArdaIkiXMax' as keyof FiltreAyarlari, label: 'Max Art Arda 2-X', aciklama: 'Arka arkaya 2 veya X gelme limiti' },
              ].map((item) => (
                <FiltreItem key={item.alan} label={item.label} aciklama={item.aciklama}>
                  <NumberInput
                    deger={filtreler[item.alan] as number | null}
                    onChange={(v) => sayisalFiltreGuncelle(item.alan, v)}
                    min={1}
                    max={15}
                    yer="Max ardışık (örn. 4)"
                  />
                </FiltreItem>
              ))}
            </div>
          </GrupKart>

          {/* GRUP 4: Özel Filtreleme */}
          <GrupKart
            baslik="Özel (Esnek) Filtreleme"
            renk="#f43f5e"
            acik={acikGruplar.g4}
            toggle={() => toggleGrup('g4')}
          >
            <p className="text-sm text-slate-400 mb-4">
              Belirli maçları gruplayarak bu gruptan kaç sürpriz geleceğini belirle. 
              Örnek: İlk 5 maçı &quot;Favori Grup&quot; olarak işaretle, bu gruptan en fazla 1 sürpriz geçsin.
            </p>
            
            {/* Maç Seçimi */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Gruba Dahil Maçlar
              </label>
              <div className="flex flex-wrap gap-2">
                {maclar.map((mac, idx) => {
                  const secili = filtreler.ozelGrupIndeksler.includes(idx);
                  return (
                    <button
                      key={mac.id}
                      onClick={() => {
                        const yeni = secili
                          ? filtreler.ozelGrupIndeksler.filter((i) => i !== idx)
                          : [...filtreler.ozelGrupIndeksler, idx];
                        filtreGuncelle('ozelGrupIndeksler', yeni);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 8,
                        border: '1px solid',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: secili ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                        borderColor: secili ? '#f43f5e' : 'rgba(99, 102, 241, 0.2)',
                        color: secili ? '#fb7185' : '#64748b',
                        transition: 'all 0.15s',
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {filtreler.ozelGrupIndeksler.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <FiltreItem label="Bu Gruptan Sürpriz" aciklama="Seçili maçlardan kaç sürpriz gelmesine izin verilsin">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">En Az</label>
                      <NumberInput deger={filtreler.ozelGrupSurprizMin} onChange={(v) => sayisalFiltreGuncelle('ozelGrupSurprizMin', v)} min={0} max={filtreler.ozelGrupIndeksler.length} yer="Min" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">En Fazla</label>
                      <NumberInput deger={filtreler.ozelGrupSurprizMax} onChange={(v) => sayisalFiltreGuncelle('ozelGrupSurprizMax', v)} min={0} max={filtreler.ozelGrupIndeksler.length} yer="Max" />
                    </div>
                  </div>
                </FiltreItem>
              </div>
            )}
          </GrupKart>
        </div>

        {/* ===== SAĞ: GERÇEK ZAMANLI FİLTRE ETKİSİ ===== */}
        <div>
          <div className="glass-card p-6 sticky top-20">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Filtre Etki Radarı
            </div>

            {/* Aktif Filtre Sayısı */}
            <div className="text-center mb-6">
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: aktifSayi > 0 ? '#818cf8' : '#334155',
                  lineHeight: 1,
                }}
              >
                {aktifSayi}
              </div>
              <div className="text-slate-400 text-sm mt-1">Aktif Filtre</div>
            </div>

            {aktifSayi > 0 ? (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Başlangıç Kolonları</span>
                  <span className="text-slate-200 font-semibold">{sayiFormat(kolonSayisi)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Elenen Kolon</span>
                  <span style={{ color: '#f87171', fontWeight: 700 }}>-{sayiFormat(filtreSonuc.toplamElenen)}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Kalan Kolon</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{sayiFormat(filtreSonuc.kalan.length)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Net Tasarruf</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{tlBicimlendir(filtreSonuc.toplamTasarruf)}</span>
                </div>

                {/* Filtrelenmiş Kolonları İndir / Gör Butonu */}
                <button
                  onClick={() => setModalAcik(true)}
                  className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 mt-4"
                >
                  <Download size={14} />
                  Kalan {filtreSonuc.kalan.length} Kolonu İndir / Gör
                </button>

                {/* Kırılım Listesi */}
                {filtreSonuc.kirilim.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300 mb-2">Filtre Kırılım Analizi:</div>
                    {filtreSonuc.kirilim.map((k, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-1 text-slate-400">
                        <span className="truncate max-w-[170px]">{k.filtreAdi}</span>
                        <span className="text-rose-400 font-semibold">-{k.elinenSayi} kolon</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 text-sm">
                Filtre seçerek kolon eleme başlar.
                <br />
                Her kolon = 10 TL tasarruf!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kolon Önizleme Modal */}
      <KolonOnizlemeModal
        acik={modalAcik}
        onKapat={() => setModalAcik(false)}
        kolonlar={filtreSonuc.kalan}
        maclar={maclar}
        baslik={`Filtrelenmiş Kolonlar (${filtreSonuc.kalan.length} Adet)`}
      />
    </div>
  );
}

// ===== YARDIMCI BİLEŞENLER =====

function GrupKart({
  baslik, renk, acik, toggle, children
}: {
  baslik: string; renk: string; acik: boolean; toggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="card p-5" style={{ borderColor: `${renk}20` }}>
      <button
        onClick={toggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: acik ? 16 : 0,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: renk,
            }}
          />
          <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{baslik}</span>
        </div>
        {acik ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
      </button>
      {acik && children}
    </div>
  );
}

function FiltreItem({
  label, aciklama, children
}: {
  label: string; aciklama?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1.5">
        <label style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{label}</label>
        {aciklama && (
          <div className="relative group">
            <Info size={12} color="#64748b" style={{ cursor: 'help' }} />
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1e293b',
                color: '#94a3b8',
                padding: '6px 10px',
                borderRadius: 8,
                fontSize: 11,
                width: 200,
                lineHeight: 1.4,
                border: '1px solid rgba(99,102,241,0.2)',
                marginBottom: 4,
                zIndex: 50,
                whiteSpace: 'normal',
                pointerEvents: 'none',
                opacity: 0,
              }}
              className="group-hover:!opacity-100 transition-opacity"
            >
              {aciklama}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function NumberInput({
  deger, onChange, min, max, yer
}: {
  deger: number | null; onChange: (v: string) => void; min: number; max: number; yer: string;
}) {
  return (
    <input
      type="number"
      className="input-dark"
      value={deger ?? ''}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      placeholder={yer}
    />
  );
}
