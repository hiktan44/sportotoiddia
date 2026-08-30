'use client';
import { useState } from 'react';
import { X, ClipboardPaste, Check, RefreshCw } from 'lucide-react';
import type { Mac } from '@/lib/kombinasyon';
import toast from 'react-hot-toast';

interface Props {
  acik: boolean;
  onKapat: () => void;
  onGuncelle: (yeniMaclar: Mac[]) => void;
  mevcutMaclar: Mac[];
}

export default function TopluBultenModal({ acik, onKapat, onGuncelle, mevcutMaclar }: Props) {
  const [metin, setMetin] = useState(
    mevcutMaclar.map((m) => `${m.id}. ${m.takim1} - ${m.takim2}`).join('\n')
  );

  if (!acik) return null;

  const handleKaydet = () => {
    try {
      const satirlar = metin
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (satirlar.length < 15) {
        toast.error(`Lütfen tam 15 maç girin (Şu an ${satirlar.length} satır var).`);
        return;
      }

      const yeniMaclar: Mac[] = satirlar.slice(0, 15).map((satir, i) => {
        // "1. Ev - Dep" veya "Ev - Dep" formatını ayıkla
        let temiz = satir.replace(/^\d+[\.\-\)\s]+/, '').trim();
        const parcalar = temiz.split(/[-–—vsVS]+/);
        const t1 = parcalar[0]?.trim() || `Ev Sahibi ${i + 1}`;
        const t2 = parcalar[1]?.trim() || `Deplasman ${i + 1}`;

        const eski = mevcutMaclar[i];
        return {
          id: i + 1,
          takim1: t1,
          takim2: t2,
          tarih: eski?.tarih || '30.08 20:00',
          lig: eski?.lig || 'Süper Lig',
          secimler: eski?.secimler || ['1'],
          tip: eski?.tip || 'tek',
        };
      });

      onGuncelle(yeniMaclar);
      toast.success('15 maç bülteni başarıyla güncellendi!');
      onKapat();
    } catch {
      toast.error('Format ayrıştırılamadı');
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
          maxWidth: 550,
          padding: 24,
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              📋 15 Maçlık Bülteni Düzenle / Yapıştır
            </h2>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
              Her satıra bir maç gelecek şekilde 15 maçı yapıştırabilirsiniz (Örn: "Galatasaray - Fenerbahçe").
            </p>
          </div>
          <button
            onClick={onKapat}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          rows={15}
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          className="input-dark"
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.6,
            width: '100%',
            resize: 'vertical',
            marginBottom: 16,
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onKapat} className="btn-secondary text-xs py-2 px-4">
            İptal
          </button>
          <button
            onClick={handleKaydet}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
          >
            <Check size={14} />
            Bülteni Kaydet & AI Analizini Yenile
          </button>
        </div>
      </div>
    </div>
  );
}
