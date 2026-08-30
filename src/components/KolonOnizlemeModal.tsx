'use client';
import { useState } from 'react';
import type { Kolon, Mac } from '@/lib/kombinasyon';
import { kolonlariExcelIndir, txtDosyasiIndir, kolonlariTxtYap, bayiFormatTxt } from '@/lib/export-utils';
import { X, Download, FileSpreadsheet, FileText, Copy, Check, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  acik: boolean;
  onKapat: () => void;
  kolonlar: Kolon[];
  maclar: Mac[];
  baslik?: string;
}

export default function KolonOnizlemeModal({ acik, onKapat, kolonlar, maclar, baslik = 'Üretilen Kolonlar' }: Props) {
  const [sayfa, setSayfa] = useState(1);
  const [arama, setArama] = useState('');
  const [kopyalandi, setKopyalandi] = useState(false);
  const sayfaBasi = 50;

  if (!acik) return null;

  const filtrelenmis = arama
    ? kolonlar.filter((k) => k.tahminler.join('').includes(arama.toUpperCase()))
    : kolonlar;

  const toplamSayfa = Math.ceil(filtrelenmis.length / sayfaBasi) || 1;
  const gosterilenler = filtrelenmis.slice((sayfa - 1) * sayfaBasi, sayfa * sayfaBasi);

  const panoyaKopyala = () => {
    const txt = bayiFormatTxt(kolonlar);
    navigator.clipboard.writeText(txt);
    setKopyalandi(true);
    toast.success(`${kolonlar.length} kolon panoya kopyalandı!`);
    setTimeout(() => setKopyalandi(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
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
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {baslik}
            </h2>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
              Toplam <strong>{kolonlar.length}</strong> Kolon | Maliyet: <strong>{kolonlar.length * 10} ₺</strong>
            </p>
          </div>
          <button
            onClick={onKapat}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 22, 41, 0.6)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Arama */}
          <div style={{ position: 'relative', minWidth: 200 }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              placeholder="Örn: 1X2..."
              value={arama}
              onChange={(e) => {
                setArama(e.target.value);
                setSayfa(1);
              }}
              className="input-dark"
              style={{ paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6, fontSize: 12 }}
            />
          </div>

          {/* Dışa Aktarma Butonları */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                kolonlariExcelIndir(kolonlar, maclar);
                toast.success('Excel dosyası indirildi');
              }}
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <FileSpreadsheet size={14} color="#10b981" />
              Excel (.xlsx)
            </button>

            <button
              onClick={() => {
                const txt = kolonlariTxtYap(kolonlar, maclar);
                txtDosyasiIndir(txt);
                toast.success('TXT listesi indirildi');
              }}
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <FileText size={14} color="#818cf8" />
              TXT İndir
            </button>

            <button
              onClick={panoyaKopyala}
              className="btn-primary"
              style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {kopyalandi ? <Check size={14} /> : <Copy size={14} />}
              {kopyalandi ? 'Kopyalandı' : 'Panoya Kopyala'}
            </button>
          </div>
        </div>

        {/* Kolon Listesi */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 8,
            }}
          >
            {gosterilenler.map((kolon, idx) => (
              <div
                key={kolon.id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                  #{(sayfa - 1) * sayfaBasi + idx + 1}
                </span>

                <div style={{ display: 'flex', gap: 3 }}>
                  {kolon.tahminler.map((t, mIdx) => (
                    <span
                      key={mIdx}
                      style={{
                        width: 14,
                        textAlign: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        color: t === '1' ? '#38bdf8' : t === 'X' ? '#facc15' : '#f87171',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & Sayfalama */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(10, 14, 26, 0.8)',
          }}
        >
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Sayfa {sayfa} / {toplamSayfa} ({filtrelenmis.length} sonuç)
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              disabled={sayfa <= 1}
              onClick={() => setSayfa((s) => Math.max(1, s - 1))}
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: 12 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={sayfa >= toplamSayfa}
              onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: 12 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
