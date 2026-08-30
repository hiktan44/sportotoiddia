import type { Kolon, MacSecim } from './kombinasyon';

// =====================================================
// FİLTRE TİPLERİ
// =====================================================

export interface FiltreAyarlari {
  // Grup 1: Sürpriz ve Beraberlik
  tersSurprizMax: number | null;         // Maksimum ters sürpriz sayısı
  beraberlikMin: number | null;          // Min beraberlik (X) sayısı
  beraberlikMax: number | null;          // Max beraberlik (X) sayısı
  toplamSurprizMin: number | null;       // Min toplam sürpriz sayısı
  toplamSurprizMax: number | null;       // Max toplam sürpriz sayısı

  // Grup 2: 1'ler ve 2'ler Sayısı
  birlerMin: number | null;              // Min ev sahibi galibiyeti
  birlerMax: number | null;              // Max ev sahibi galibiyeti
  ikilerMin: number | null;              // Min deplasman galibiyeti
  ikilerMax: number | null;             // Max deplasman galibiyeti

  // Grup 3: Art Arda Sonuç Filtreleri
  artArdaBirMax: number | null;         // Max art arda 1
  artArdaIkiMax: number | null;         // Max art arda 2
  artArdaXMax: number | null;           // Max art arda X
  artArdaBirXMax: number | null;        // Max art arda 1 veya X
  artArdaIkiXMax: number | null;        // Max art arda 2 veya X

  // Grup 4: Özel Filtreleme
  ozelGrupIndeksler: number[];          // Özel gruba dahil maç indeksleri (0-based)
  ozelGrupSurprizMin: number | null;    // Bu gruptan min sürpriz
  ozelGrupSurprizMax: number | null;    // Bu gruptan max sürpriz
}

export function varsayilanFiltreler(): FiltreAyarlari {
  return {
    tersSurprizMax: null,
    beraberlikMin: null,
    beraberlikMax: null,
    toplamSurprizMin: null,
    toplamSurprizMax: null,
    birlerMin: null,
    birlerMax: null,
    ikilerMin: null,
    ikilerMax: null,
    artArdaBirMax: null,
    artArdaIkiMax: null,
    artArdaXMax: null,
    artArdaBirXMax: null,
    artArdaIkiXMax: null,
    ozelGrupIndeksler: [],
    ozelGrupSurprizMin: null,
    ozelGrupSurprizMax: null,
  };
}

// =====================================================
// FİLTRELEME MOTORU
// =====================================================

/**
 * Bir seçim "ters sürpriz" ise: favori 1 iken 2 geldi veya favori 2 iken 1 geldi.
 * X (beraberlik) ters sürpriz sayılmaz.
 */
function tersSurprizMi(beklenen: MacSecim, gelen: MacSecim): boolean {
  if (beklenen === '1' && gelen === '2') return true;
  if (beklenen === '2' && gelen === '1') return true;
  return false;
}

// İç kullanım için alias
const beklened_fixed = tersSurprizMi;

/**
 * Ana filtreleme fonksiyonu.
 * Verilen kolonları filtre ayarlarına göre elek'ten geçirir.
 * Elenen her kolon = 10 TL tasarruf!
 */
export function filtrele(
  kolonlar: Kolon[],
  filtreler: FiltreAyarlari,
  bankoIndeksler: number[] = [],   // Banko maçlar (art arda filtresine takılmaz)
  favoriler: MacSecim[] = []        // Her maçın "favori" tahmini (sürpriz hesabı için)
): { kalan: Kolon[]; elinenSayi: number } {
  const kalan = kolonlar.filter((kolon) => {
    const tahminler = kolon.tahminler;

    // --- Beraberlik Sayısı ---
    const xSayisi = tahminler.filter((t) => t === 'X').length;
    if (filtreler.beraberlikMax !== null && xSayisi > filtreler.beraberlikMax) return false;
    if (filtreler.beraberlikMin !== null && xSayisi < filtreler.beraberlikMin) return false;

    // --- 1'ler ve 2'ler Sayısı ---
    const birSayisi = tahminler.filter((t) => t === '1').length;
    const ikiSayisi = tahminler.filter((t) => t === '2').length;
    if (filtreler.birlerMax !== null && birSayisi > filtreler.birlerMax) return false;
    if (filtreler.birlerMin !== null && birSayisi < filtreler.birlerMin) return false;
    if (filtreler.ikilerMax !== null && ikiSayisi > filtreler.ikilerMax) return false;
    if (filtreler.ikilerMin !== null && ikiSayisi < filtreler.ikilerMin) return false;

    // --- Toplam Sürpriz ---
    if (filtreler.toplamSurprizMax !== null || filtreler.toplamSurprizMin !== null) {
      const surprizSayisi = favoriler.length > 0
        ? tahminler.filter((t, i) => beklened_fixed(favoriler[i], t)).length
        : 0;
      if (filtreler.toplamSurprizMax !== null && surprizSayisi > filtreler.toplamSurprizMax) return false;
      if (filtreler.toplamSurprizMin !== null && surprizSayisi < filtreler.toplamSurprizMin) return false;
    }

    // --- Ters Sürpriz ---
    if (filtreler.tersSurprizMax !== null && favoriler.length > 0) {
      const tersSurpriz = tahminler.filter((t, i) => beklened_fixed(favoriler[i], t)).length;
      if (tersSurpriz > filtreler.tersSurprizMax) return false;
    }

    // --- Art Arda 1 ---
    if (filtreler.artArdaBirMax !== null) {
      if (artArdaKontrol(tahminler, ['1'], filtreler.artArdaBirMax, bankoIndeksler)) return false;
    }

    // --- Art Arda 2 ---
    if (filtreler.artArdaIkiMax !== null) {
      if (artArdaKontrol(tahminler, ['2'], filtreler.artArdaIkiMax, bankoIndeksler)) return false;
    }

    // --- Art Arda X ---
    if (filtreler.artArdaXMax !== null) {
      if (artArdaKontrol(tahminler, ['X'], filtreler.artArdaXMax, bankoIndeksler)) return false;
    }

    // --- Art Arda 1-X ---
    if (filtreler.artArdaBirXMax !== null) {
      if (artArdaKontrol(tahminler, ['1', 'X'], filtreler.artArdaBirXMax, bankoIndeksler)) return false;
    }

    // --- Art Arda 2-X ---
    if (filtreler.artArdaIkiXMax !== null) {
      if (artArdaKontrol(tahminler, ['2', 'X'], filtreler.artArdaIkiXMax, bankoIndeksler)) return false;
    }

    // --- Özel Grup Filtreleri ---
    if (
      filtreler.ozelGrupIndeksler.length > 0 &&
      (filtreler.ozelGrupSurprizMax !== null || filtreler.ozelGrupSurprizMin !== null) &&
      favoriler.length > 0
    ) {
      const grupSurpriz = filtreler.ozelGrupIndeksler.filter((idx) =>
        beklened_fixed(favoriler[idx], tahminler[idx])
      ).length;
      if (filtreler.ozelGrupSurprizMax !== null && grupSurpriz > filtreler.ozelGrupSurprizMax) return false;
      if (filtreler.ozelGrupSurprizMin !== null && grupSurpriz < filtreler.ozelGrupSurprizMin) return false;
    }

    return true;
  });

  return {
    kalan,
    elinenSayi: kolonlar.length - kalan.length,
  };
}

/**
 * Art arda kontrol — belirli sonuçların max ardışık sayısını kontrol eder.
 * Banko maçlar bu filtreye takılmaz (PRD kuralı).
 */
function artArdaKontrol(
  tahminler: MacSecim[],
  hedefler: MacSecim[],
  maxArtArda: number,
  bankoIndeksler: number[]
): boolean {  // true => bu kolon elensin
  let ardisikSayac = 0;
  for (let i = 0; i < tahminler.length; i++) {
    if (bankoIndeksler.includes(i)) {
      ardisikSayac = 0; // Banko sıralamayı sıfırlar
      continue;
    }
    if (hedefler.includes(tahminler[i])) {
      ardisikSayac++;
      if (ardisikSayac > maxArtArda) return true; // Eleme
    } else {
      ardisikSayac = 0;
    }
  }
  return false;
}

// =====================================================
// AYNI/KAPSAYAN KOLON SİLME
// =====================================================

/**
 * Birden fazla kupondaki birebir aynı kolonları siler.
 * Kapsayan kolonlar da silinir (kazanma ihtimali düşmez!).
 */
export function benzerKolonlariSil(tumKolonlar: Kolon[][]): {
  birlesik: Kolon[];
  silinenSayi: number;
} {
  const gorulduler = new Set<string>();
  const benzersiz: Kolon[] = [];
  let silinenSayi = 0;

  for (const kupon of tumKolonlar) {
    for (const kolon of kupon) {
      const anahtar = kolon.tahminler.join('');
      if (!gorulduler.has(anahtar)) {
        gorulduler.add(anahtar);
        benzersiz.push(kolon);
      } else {
        silinenSayi++;
      }
    }
  }

  return { birlesik: benzersiz, silinenSayi };
}

// =====================================================
// ETKİN FİLTRE SAYISI
// =====================================================
export function aktifFiltreAdet(filtreler: FiltreAyarlari): number {
  let sayi = 0;
  const alanlar: (keyof FiltreAyarlari)[] = [
    'tersSurprizMax', 'beraberlikMin', 'beraberlikMax',
    'toplamSurprizMin', 'toplamSurprizMax',
    'birlerMin', 'birlerMax', 'ikilerMin', 'ikilerMax',
    'artArdaBirMax', 'artArdaIkiMax', 'artArdaXMax',
    'artArdaBirXMax', 'artArdaIkiXMax',
    'ozelGrupSurprizMin', 'ozelGrupSurprizMax',
  ];
  for (const alan of alanlar) {
    if (filtreler[alan] !== null) sayi++;
  }
  if (filtreler.ozelGrupIndeksler.length > 0) sayi++;
  return sayi;
}

// =====================================================
// DETAYLI FİLTRE ETKİ ANALİZİ (WATERFALL / BREAKDOWN)
// =====================================================

export interface FiltreKirilim {
  filtreAdi: string;
  elinenSayi: number;
  tasarrufTL: number;
}

export function filtreDetayliAnaliz(
  kolonlar: Kolon[],
  filtreler: FiltreAyarlari,
  bankoIndeksler: number[] = [],
  favoriler: MacSecim[] = []
): { kalan: Kolon[]; kirilim: FiltreKirilim[]; toplamElenen: number; toplamTasarruf: number } {
  const kirilim: FiltreKirilim[] = [];
  let mevcut = [...kolonlar];

  const testEt = (filtreAdi: string, tekFiltre: Partial<FiltreAyarlari>) => {
    const ayar: FiltreAyarlari = { ...varsayilanFiltreler(), ...tekFiltre };
    const sonuc = filtrele(mevcut, ayar, bankoIndeksler, favoriler);
    const elenen = mevcut.length - sonuc.kalan.length;
    if (elenen > 0) {
      kirilim.push({
        filtreAdi,
        elinenSayi: elenen,
        tasarrufTL: elenen * 10,
      });
      mevcut = sonuc.kalan;
    }
  };

  if (filtreler.tersSurprizMax !== null) {
    testEt(`Ters Sürpriz (Max ${filtreler.tersSurprizMax})`, { tersSurprizMax: filtreler.tersSurprizMax });
  }
  if (filtreler.beraberlikMin !== null || filtreler.beraberlikMax !== null) {
    testEt(`Beraberlik Sınırı (${filtreler.beraberlikMin ?? 0}-${filtreler.beraberlikMax ?? 15})`, {
      beraberlikMin: filtreler.beraberlikMin,
      beraberlikMax: filtreler.beraberlikMax,
    });
  }
  if (filtreler.toplamSurprizMin !== null || filtreler.toplamSurprizMax !== null) {
    testEt(`Toplam Sürpriz (${filtreler.toplamSurprizMin ?? 0}-${filtreler.toplamSurprizMax ?? 15})`, {
      toplamSurprizMin: filtreler.toplamSurprizMin,
      toplamSurprizMax: filtreler.toplamSurprizMax,
    });
  }
  if (filtreler.birlerMin !== null || filtreler.birlerMax !== null) {
    testEt(`1'ler Sınırı (${filtreler.birlerMin ?? 0}-${filtreler.birlerMax ?? 15})`, {
      birlerMin: filtreler.birlerMin,
      birlerMax: filtreler.birlerMax,
    });
  }
  if (filtreler.ikilerMin !== null || filtreler.ikilerMax !== null) {
    testEt(`2'ler Sınırı (${filtreler.ikilerMin ?? 0}-${filtreler.ikilerMax ?? 15})`, {
      ikilerMin: filtreler.ikilerMin,
      ikilerMax: filtreler.ikilerMax,
    });
  }
  if (filtreler.artArdaBirMax !== null) {
    testEt(`Art Arda 1 (Max ${filtreler.artArdaBirMax})`, { artArdaBirMax: filtreler.artArdaBirMax });
  }
  if (filtreler.artArdaIkiMax !== null) {
    testEt(`Art Arda 2 (Max ${filtreler.artArdaIkiMax})`, { artArdaIkiMax: filtreler.artArdaIkiMax });
  }
  if (filtreler.artArdaXMax !== null) {
    testEt(`Art Arda X (Max ${filtreler.artArdaXMax})`, { artArdaXMax: filtreler.artArdaXMax });
  }
  if (filtreler.artArdaBirXMax !== null) {
    testEt(`Art Arda 1-X (Max ${filtreler.artArdaBirXMax})`, { artArdaBirXMax: filtreler.artArdaBirXMax });
  }
  if (filtreler.artArdaIkiXMax !== null) {
    testEt(`Art Arda 2-X (Max ${filtreler.artArdaIkiXMax})`, { artArdaIkiXMax: filtreler.artArdaIkiXMax });
  }
  if (filtreler.ozelGrupIndeksler.length > 0 && (filtreler.ozelGrupSurprizMin !== null || filtreler.ozelGrupSurprizMax !== null)) {
    testEt(`Özel Grup Sürpriz Filtresi (${filtreler.ozelGrupIndeksler.length} Maç)`, {
      ozelGrupIndeksler: filtreler.ozelGrupIndeksler,
      ozelGrupSurprizMin: filtreler.ozelGrupSurprizMin,
      ozelGrupSurprizMax: filtreler.ozelGrupSurprizMax,
    });
  }

  const toplamElenen = kolonlar.length - mevcut.length;
  return {
    kalan: mevcut,
    kirilim,
    toplamElenen,
    toplamTasarruf: toplamElenen * 10,
  };
}
