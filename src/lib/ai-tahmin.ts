import type { Mac, MacSecim } from './kombinasyon';

export interface MacAnaliz {
  macId: number;
  evForm: number;        // 1-10 arası form puanı
  depForm: number;       // 1-10 arası form puanı
  evXG: number;          // Beklenen gol
  depXG: number;         // Beklenen gol
  olasilik1: number;     // % cinsinden (örn. 52)
  olasilikX: number;     // % cinsinden (örn. 28)
  olasilik2: number;     // % cinsinden (örn. 20)
  aiOneri: MacSecim[];   // AI tavsiye seçimleri
  aiGuven: number;       // 1-100 arası güven skoru
  riskDerecesi: 'Düşük' | 'Orta' | 'Yüksek';
}

// 2026/2027 3. Hafta maçları için taktik ve form analizi veritabanı
const HAZIR_ANALIZLER: Record<number, Partial<MacAnaliz>> = {
  1: { evForm: 7.2, depForm: 6.8, evXG: 1.5, depXG: 1.3, olasilik1: 45, olasilikX: 30, olasilik2: 25, riskDerecesi: 'Orta' },   // Eyüpspor vs Alanyaspor
  2: { evForm: 8.0, depForm: 6.0, evXG: 1.9, depXG: 0.9, olasilik1: 62, olasilikX: 23, olasilik2: 15, riskDerecesi: 'Düşük' },  // Başakşehir vs Kasımpaşa
  3: { evForm: 6.5, depForm: 8.8, evXG: 1.1, depXG: 2.2, olasilik1: 20, olasilikX: 26, olasilik2: 54, riskDerecesi: 'Düşük' },  // Samsunspor vs Fenerbahçe
  4: { evForm: 6.0, depForm: 8.4, evXG: 0.9, depXG: 2.0, olasilik1: 18, olasilikX: 25, olasilik2: 57, riskDerecesi: 'Düşük' },  // Amed vs Trabzonspor
  5: { evForm: 8.7, depForm: 5.5, evXG: 2.4, depXG: 0.7, olasilik1: 75, olasilikX: 16, olasilik2: 9, riskDerecesi: 'Düşük' },   // Beşiktaş vs Çorum FK
  6: { evForm: 9.0, depForm: 5.8, evXG: 2.6, depXG: 0.8, olasilik1: 78, olasilikX: 14, olasilik2: 8, riskDerecesi: 'Düşük' },   // Galatasaray vs Kayserispor
  7: { evForm: 7.0, depForm: 6.9, evXG: 1.4, depXG: 1.3, olasilik1: 42, olasilikX: 33, olasilik2: 25, riskDerecesi: 'Orta' },   // Konyaspor vs Antalyaspor
  8: { evForm: 7.1, depForm: 6.6, evXG: 1.6, depXG: 1.2, olasilik1: 48, olasilikX: 28, olasilik2: 24, riskDerecesi: 'Orta' },   // Rizespor vs Göztepe
  9: { evForm: 6.8, depForm: 6.5, evXG: 1.3, depXG: 1.3, olasilik1: 40, olasilikX: 32, olasilik2: 28, riskDerecesi: 'Orta' },   // Sivasspor vs Gaziantep FK
  10: { evForm: 8.9, depForm: 7.2, evXG: 2.3, depXG: 1.1, olasilik1: 68, olasilikX: 20, olasilik2: 12, riskDerecesi: 'Düşük' }, // Arsenal vs Brighton
  11: { evForm: 7.4, depForm: 8.6, evXG: 1.5, depXG: 2.1, olasilik1: 30, olasilikX: 26, olasilik2: 44, riskDerecesi: 'Yüksek' },// Man United vs Liverpool
  12: { evForm: 8.2, depForm: 7.8, evXG: 1.8, depXG: 1.3, olasilik1: 52, olasilikX: 28, olasilik2: 20, riskDerecesi: 'Orta' },  // Juventus vs Roma
  13: { evForm: 7.5, depForm: 7.9, evXG: 1.6, depXG: 1.7, olasilik1: 36, olasilikX: 28, olasilik2: 36, riskDerecesi: 'Yüksek' },// Lazio vs Milan
  14: { evForm: 9.2, depForm: 7.3, evXG: 2.7, depXG: 0.9, olasilik1: 76, olasilikX: 15, olasilik2: 9, riskDerecesi: 'Düşük' },  // Real Madrid vs Betis
  15: { evForm: 9.1, depForm: 7.0, evXG: 2.8, depXG: 1.0, olasilik1: 74, olasilikX: 16, olasilik2: 10, riskDerecesi: 'Düşük' }, // Bayern vs Freiburg
};

export function macAnaliziGetir(mac: Mac): MacAnaliz {
  const defaultAnaliz = HAZIR_ANALIZLER[mac.id] || {
    evForm: 7.0,
    depForm: 6.5,
    evXG: 1.5,
    depXG: 1.2,
    olasilik1: 45,
    olasilikX: 28,
    olasilik2: 27,
    riskDerecesi: 'Orta' as const,
  };

  const o1 = defaultAnaliz.olasilik1 || 45;
  const oX = defaultAnaliz.olasilikX || 28;
  const o2 = defaultAnaliz.olasilik2 || 27;

  let aiOneri: MacSecim[] = [];
  if (o1 >= 60) aiOneri = ['1'];
  else if (o2 >= 55) aiOneri = ['2'];
  else if (o1 >= 40 && oX >= 25) aiOneri = ['1', 'X'];
  else if (o2 >= 40 && oX >= 25) aiOneri = ['X', '2'];
  else aiOneri = ['1', '2'];

  const aiGuven = Math.max(o1, oX, o2);

  return {
    macId: mac.id,
    evForm: defaultAnaliz.evForm || 7.0,
    depForm: defaultAnaliz.depForm || 6.5,
    evXG: defaultAnaliz.evXG || 1.5,
    depXG: defaultAnaliz.depXG || 1.2,
    olasilik1: o1,
    olasilikX: oX,
    olasilik2: o2,
    aiOneri,
    aiGuven,
    riskDerecesi: defaultAnaliz.riskDerecesi || 'Orta',
  };
}

export type SihirbazStratejisi = 'favori' | 'dengeli' | 'surpriz';

/**
 * Seçilen stratejiye göre 15 maçı otomatik optimize edilmiş seçimlerle doldurur.
 */
export function aiKuponOlustur(maclar: Mac[], strateji: SihirbazStratejisi): Mac[] {
  return maclar.map((mac) => {
    const analiz = macAnaliziGetir(mac);

    if (strateji === 'favori') {
      // Favori stratejisi: En yüksek olasılığa banko/tek, diğerlerine güvenli çifte
      if (analiz.aiGuven >= 52) {
        const enYuksek: MacSecim = analiz.olasilik1 >= analiz.olasilik2 ? (analiz.olasilik1 >= analiz.olasilikX ? '1' : 'X') : (analiz.olasilik2 >= analiz.olasilikX ? '2' : 'X');
        return { ...mac, tip: 'banko', secimler: [enYuksek] };
      }
      return { ...mac, tip: 'cift', secimler: analiz.aiOneri };
    }

    if (strateji === 'surpriz') {
      // Sürpriz stratejisi: Beraberlik ve deplasman sürprizlerini dahil et
      if (analiz.riskDerecesi === 'Yüksek') {
        return { ...mac, tip: 'cift', secimler: ['X', '2'] };
      }
      return { ...mac, tip: 'cift', secimler: ['1', 'X'] };
    }

    // Dengeli (İdeal) stratejisi:
    if (analiz.aiGuven >= 55) {
      const enYuksek: MacSecim = analiz.olasilik1 >= analiz.olasilik2 ? '1' : '2';
      return { ...mac, tip: 'tek', secimler: [enYuksek] };
    }
    return { ...mac, tip: 'cift', secimler: analiz.aiOneri };
  });
}
