'use client';
import { Sparkles, TrendingUp, ShieldAlert, Cpu, Flame, Target } from 'lucide-react';
import type { SihirbazStratejisi } from '@/lib/ai-tahmin';
import toast from 'react-hot-toast';

interface Props {
  onStratejiUygula: (strateji: SihirbazStratejisi) => void;
}

export default function AiSihirbaz({ onStratejiUygula }: Props) {
  return (
    <div
      className="card p-4 mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>
              Spor Toto AI Sihirbazı
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              xG ve Poisson analizleriyle 15 maçı tek tıkla otomatik doldurun
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              onStratejiUygula('favori');
              toast.success('🤖 AI Favori Kuponu uygulandı!');
            }}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ShieldAlert size={14} color="#10b981" />
            AI Favoriler
          </button>

          <button
            onClick={() => {
              onStratejiUygula('dengeli');
              toast.success('🎯 AI Dengeli Kupon uygulandı!');
            }}
            className="btn-primary"
            style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Target size={14} />
            AI Dengeli (İdeal)
          </button>

          <button
            onClick={() => {
              onStratejiUygula('surpriz');
              toast.success('⚡ AI Sürpriz Kuponu uygulandı!');
            }}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Flame size={14} color="#f59e0b" />
            AI Sürpriz Avcısı
          </button>
        </div>
      </div>
    </div>
  );
}
