// =====================================================
// TEMEL TİPLER
// =====================================================

export type MacSecim = '1' | 'X' | '2';
export type MacTipi = 'banko' | 'tek' | 'cift';

export interface Mac {
  id: number;
  takim1: string;
  takim2: string;
  tarih?: string;   // örn. "04.04 20:00"
  lig?: string;     // örn. "Süper Lig"
  secimler: MacSecim[];  // seçilen tahminler (1, X, 2 — birden fazla olabilir çift için)
  tip: MacTipi;
}

export interface Kolon {
  id: number;
  tahminler: MacSecim[];  // 15 elemanlı dizi, her maç için tahmin
}

// =====================================================
// KOMBİNASYON MOTORU
// =====================================================

/**
 * Verilen maçların tüm olası kombinasyonlarını üretir.
 * Her maçın seçimleri (1/X/2 veya çiftliyse birden fazla) kartezyen çarpımla birleştirilir.
 */
export function kombinasyonUret(maclar: Mac[], maxLimit = 10000): Kolon[] {
  if (maclar.length === 0) return [];

  const toplamOlasilik = kolonSayisiHesapla(maclar);

  // Her maç için olası seçimler listesi
  const secimListesi: MacSecim[][] = maclar.map((mac) => {
    if (mac.tip === 'banko') {
      return mac.secimler.slice(0, 1);
    }
    if (mac.tip === 'tek') {
      return mac.secimler.slice(0, 1);
    }
    return mac.secimler.length > 0 ? mac.secimler : ['1'];
  });

  // Eğer kombinasyon sayısı çok büyükse bellek taşmasını önlemek için sınırlı kartezyen üret
  if (toplamOlasilik > maxLimit) {
    const orneklem: MacSecim[][] = [];
    // Güvenli sınırlı üretim
    const uretilen = kartezyenLimitli(secimListesi, maxLimit);
    return uretilen.map((tahminler, idx) => ({
      id: idx + 1,
      tahminler,
    }));
  }

  // Kartezyen çarpım
  const kombinasyonlar = kartezyen(secimListesi);

  return kombinasyonlar.map((tahminler, idx) => ({
    id: idx + 1,
    tahminler,
  }));
}

function kartezyen(diziler: MacSecim[][]): MacSecim[][] {
  return diziler.reduce<MacSecim[][]>(
    (sonuc, dizi) => {
      return sonuc.flatMap((mevcut) => dizi.map((eleman) => [...mevcut, eleman]));
    },
    [[]]
  );
}

function kartezyenLimitli(diziler: MacSecim[][], limit: number): MacSecim[][] {
  const sonuc: MacSecim[][] = [];
  function backtrack(idx: number, mevcut: MacSecim[]) {
    if (sonuc.length >= limit) return;
    if (idx === diziler.length) {
      sonuc.push([...mevcut]);
      return;
    }
    for (const secim of diziler[idx]) {
      mevcut.push(secim);
      backtrack(idx + 1, mevcut);
      mevcut.pop();
      if (sonuc.length >= limit) return;
    }
  }
  backtrack(0, []);
  return sonuc;
}

// =====================================================
// KOMBİNASYON SAYISI (Ağır hesaplama yapmadan önce)
// =====================================================

export function kolonSayisiHesapla(maclar: Mac[]): number {
  if (maclar.length === 0) return 0;
  return maclar.reduce((carpim, mac) => {
    const secimSayisi = mac.tip === 'banko' ? 1 : mac.secimler.length;
    return carpim * secimSayisi;
  }, 1);
}

export function maliyetHesapla(kolonSayisi: number, kolonBedeli = 10): number {
  return kolonSayisi * kolonBedeli;
}

// =====================================================
// MAÇLARIN YÜZDE DAĞILIMI
// =====================================================
export function macDagilimHesapla(maclar: Mac[]) {
  const bankoSayisi = maclar.filter((m) => m.tip === 'banko').length;
  const tekSayisi = maclar.filter((m) => m.tip === 'tek').length;
  const ciftSayisi = maclar.filter((m) => m.tip === 'cift').length;
  return { bankoSayisi, tekSayisi, ciftSayisi };
}

// =====================================================
// VARSAYILAN MAÇLAR (Demo)
// =====================================================
export function varsayilanMaclarOlustur(adet = 15): Mac[] {
  return Array.from({ length: adet }, (_, i) => ({
    id: i + 1,
    takim1: `Ev ${i + 1}`,
    takim2: `Dep ${i + 1}`,
    secimler: ['1', 'X', '2'],
    tip: 'cift',
  }));
}
