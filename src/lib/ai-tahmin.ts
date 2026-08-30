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

// 35. Hafta maçları için gerçekçi taktik ve form analizi veritabanı
const HAZIR_ANALIZLER: Record<number, Partial<MacAnaliz>> = {
  1: { evForm: 6.5, depForm: 7.0, evXG: 1.2, depXG: 1.4, olasilik1: 34, olasilikX: 30, olasilik2: 36, riskDerecesi: 'Yüksek' },
  2: { evForm: 7.2, depForm: 5.8, evXG: 1.6, depXG: 1.1, olasilik1: 48, olasilikX: 28, olasilik2: 24, riskDerecesi: 'Orta' },
  3: { evForm: 6.0, depForm: 6.2, evXG: 1.3, depXG: 1.3, olasilik1: 38, olasilikX: 32, olasilik2: 30, riskDerecesi: 'Orta' },
  4: { evForm: 7.5, depForm: 8.8, evXG: 1.4, depXG: 2.1, olasilik1: 28, olasilikX: 24, olasilik2: 48, riskDerecesi: 'Orta' },
  5: { evForm: 6.8, depForm: 5.5, evXG: 1.5, depXG: 1.0, olasilik1: 52, olasilikX: 26, olasilik2: 22, riskDerecesi: 'Düşük' },
  6: { evForm: 7.8, depForm: 5.2, evXG: 1.7, depXG: 0.9, olasilik1: 58, olasilikX: 24, olasilik2: 18, riskDerecesi: 'Düşük' },
  7: { evForm: 6.2, depForm: 7.1, evXG: 1.2, depXG: 1.5, olasilik1: 32, olasilikX: 29, olasilik2: 39, riskDerecesi: 'Yüksek' },
  8: { evForm: 8.5, depForm: 7.6, evXG: 2.0, depXG: 1.3, olasilik1: 54, olasilikX: 25, olasilik2: 21, riskDerecesi: 'Orta' },
  9: { evForm: 6.1, depForm: 7.4, evXG: 1.1, depXG: 1.6, olasilik1: 29, olasilikX: 27, olasilik2: 44, riskDerecesi: 'Orta' },
  10: { evForm: 7.0, depForm: 6.0, evXG: 1.6, depXG: 1.2, olasilik1: 46, olasilikX: 27, olasilik2: 27, riskDerecesi: 'Orta' },
  11: { evForm: 7.9, depForm: 8.1, evXG: 1.8, depXG: 1.9, olasilik1: 37, olasilikX: 26, olasilik2: 37, riskDerecesi: 'Yüksek' },
  12: { evForm: 7.6, depForm: 7.2, evXG: 1.7, depXG: 1.3, olasilik1: 49, olasilikX: 28, olasilik2: 23, riskDerecesi: 'Orta' },
  13: { evForm: 8.0, depForm: 7.8, evXG: 1.9, depXG: 1.7, olasilik1: 42, olasilikX: 28, olasilik2: 30, riskDerecesi: 'Orta' },
  14: { evForm: 8.2, depForm: 8.9, evXG: 1.6, depXG: 2.0, olasilik1: 33, olasilikX: 27, olasilik2: 40, riskDerecesi: 'Yüksek' },
  15: { evForm: 8.7, depForm: 7.5, evXG: 2.1, depXG: 1.1, olasilik1: 60, olasilikX: 23, olasilik2: 17, riskDerecesi: 'Düşük' },
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
  if (o1 >= 55) aiOneri = ['1'];
  else if (o2 >= 50) aiOneri = ['2'];
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
