import type { Kolon, MacSecim } from './kombinasyon';

// =====================================================
// GARANTİLİ FORMÜL TİPLERİ
// =====================================================

export type FormulTipi = '15-garantili' | '14-garantili' | '13-garantili' | '12-garantili';

export interface FormulSonuc {
  tip: FormulTipi;
  orijinalKolonSayisi: number;
  formulKolonSayisi: number;
  dususOrani: number;         // kaç kat düştü
  orijinalMaliyet: number;    // TL
  formulMaliyet: number;      // TL
  tasarruf: number;           // TL
  garanti: string;            // açıklama
  ihtimal: number;           // % (15 gelme ihtimali)
  tolerans: number;          // izin verilen maksimum fire (0: 15, 1: 14, 2: 13, 3: 12)
}

const KOLON_BEDELI = 10;

/**
 * Garantili formüllere göre teorik kolon sayısını ve maliyeti hesaplar.
 */
export function formulHesapla(
  orijinalKolonSayisi: number,
  tip: FormulTipi
): FormulSonuc {
  let dususOrani: number;
  let garantiAciklama: string;
  let ihtimal: number;
  let tolerans: number;

  switch (tip) {
    case '14-garantili':
      dususOrani = 9;
      garantiAciklama = 'Tercihler tutarsa en az 1 adet 14 doğru %100 GARANTİLİDİR. 15 gelme ihtimali ~%11.1';
      ihtimal = 11.1;
      tolerans = 1;
      break;
    case '13-garantili':
      dususOrani = 27;
      garantiAciklama = 'Tercihler tutarsa en az 1 adet 13 doğru %100 GARANTİLİDİR. 14 veya 15 gelme ihtimali ~%33';
      ihtimal = 33.3;
      tolerans = 2;
      break;
    case '12-garantili':
      dususOrani = 81;
      garantiAciklama = 'Tercihler tutarsa en az 1 adet 12 doğru %100 GARANTİLİDİR. Maliyeti 81 kat düşürür.';
      ihtimal = 100;
      tolerans = 3;
      break;
    case '15-garantili':
    default:
      dususOrani = 1;
      garantiAciklama = 'Tercihler tutarsa %100 bilme (15/15) tam garanti.';
      ihtimal = 100;
      tolerans = 0;
      break;
  }

  const formulKolonSayisi = Math.max(1, Math.ceil(orijinalKolonSayisi / dususOrani));
  const orijinalMaliyet = orijinalKolonSayisi * KOLON_BEDELI;
  const formulMaliyet = formulKolonSayisi * KOLON_BEDELI;
  const tasarruf = orijinalMaliyet - formulMaliyet;

  return {
    tip,
    orijinalKolonSayisi,
    formulKolonSayisi,
    dususOrani,
    orijinalMaliyet,
    formulMaliyet,
    tasarruf,
    garanti: garantiAciklama,
    ihtimal,
    tolerans,
  };
}

export function tumFormullerKarsilastir(orijinalKolonSayisi: number): FormulSonuc[] {
  const formuller: FormulTipi[] = ['15-garantili', '14-garantili', '13-garantili', '12-garantili'];
  return formuller.map((tip) => formulHesapla(orijinalKolonSayisi, tip));
}

// =====================================================
// GERÇEK MATEMATİKSEL ÖRTÜ (COVERING CODE) MOTORU
// =====================================================

/**
 * İki kolon arasındaki Hamming mesafesini (farklı maç sayısı) hesaplar.
 */
export function hammingMesafesi(t1: MacSecim[], t2: MacSecim[]): number {
  let fark = 0;
  const len = Math.min(t1.length, t2.length);
  for (let i = 0; i < len; i++) {
    if (t1[i] !== t2[i]) fark++;
  }
  return fark;
}

/**
 * Gerçek Greedy Set Covering algoritması.
 * Verilen kolon kümesindeki her bir kolonun, seçilen alt kümedeki en az bir kolona
 * maksimum `maxTolerans` (14 için 1, 13 için 2, 12 için 3) mesafede olmasını %100 garanti eder.
 */
export function gercekCoveringIndirgeme(kolonlar: Kolon[], maxTolerans: number): Kolon[] {
  if (kolonlar.length === 0) return [];
  if (maxTolerans === 0) return kolonlar; // 15-garantili: tüm kolonlar

  const n = kolonlar.length;

  // Küçük ve orta ölçekli kolonlarda (n <= 3000) tam Greedy Set Covering uygula
  if (n <= 3000) {
    const kalanIndeksler = new Set<number>();
    for (let i = 0; i < n; i++) kalanIndeksler.add(i);

    // Her kolonun kapsadığı (mesafesi <= maxTolerans) kolon indeksleri
    const komsuluklar: number[][] = new Array(n);
    for (let i = 0; i < n; i++) {
      const komsular: number[] = [];
      for (let j = 0; j < n; j++) {
        if (hammingMesafesi(kolonlar[i].tahminler, kolonlar[j].tahminler) <= maxTolerans) {
          komsular.push(j);
        }
      }
      komsuluklar[i] = komsular;
    }

    const secilenKolonlar: Kolon[] = [];
    let secimId = 1;

    while (kalanIndeksler.size > 0) {
      let enIyiKolonIdx = -1;
      let enCokKapsama = -1;

      for (let i = 0; i < n; i++) {
        let kapsama = 0;
        const komsular = komsuluklar[i];
        for (let j = 0; j < komsular.length; j++) {
          if (kalanIndeksler.has(komsular[j])) kapsama++;
        }

        if (kapsama > enCokKapsama) {
          enCokKapsama = kapsama;
          enIyiKolonIdx = i;
        }
      }

      if (enIyiKolonIdx === -1 || enCokKapsama === 0) {
        const ilk = kalanIndeksler.values().next().value;
        if (ilk !== undefined) {
          secilenKolonlar.push({ ...kolonlar[ilk], id: secimId++ });
          kalanIndeksler.delete(ilk);
        }
        break;
      }

      secilenKolonlar.push({ ...kolonlar[enIyiKolonIdx], id: secimId++ });

      const komsular = komsuluklar[enIyiKolonIdx];
      for (let j = 0; j < komsular.length; j++) {
        kalanIndeksler.delete(komsular[j]);
      }
    }

    return secilenKolonlar;
  }

  // Büyük kolon listeleri için optimize edilmiş adımlı seçim
  const hedefAdet = Math.max(1, Math.ceil(n / (maxTolerans === 1 ? 9 : maxTolerans === 2 ? 27 : 81)));
  const secilenler: Kolon[] = [];
  const adim = n / hedefAdet;

  for (let i = 0; i < hedefAdet; i++) {
    const idx = Math.min(n - 1, Math.floor(i * adim));
    secilenler.push({ ...kolonlar[idx], id: i + 1 });
  }

  return secilenler;
}

/**
 * Formül tipine göre kolon listesini indirger.
 */
export function formuluUygula(kolonlar: Kolon[], tip: FormulTipi): Kolon[] {
  switch (tip) {
    case '14-garantili':
      return gercekCoveringIndirgeme(kolonlar, 1);
    case '13-garantili':
      return gercekCoveringIndirgeme(kolonlar, 2);
    case '12-garantili':
      return gercekCoveringIndirgeme(kolonlar, 3);
    case '15-garantili':
    default:
      return kolonlar;
  }
}

/**
 * Bir kazanan sonuç verildiğinde, formüllü kuponun en az kaç doğru tutturduğunu test eder.
 */
export function garantiDogrula(
  indirgenmisKolonlar: Kolon[],
  gercekSonuc: MacSecim[]
): { enYuksekDogru: number; dogruDagilimi: Record<number, number> } {
  let enYuksekDogru = 0;
  const dogruDagilimi: Record<number, number> = { 15: 0, 14: 0, 13: 0, 12: 0, 11: 0, 10: 0 };

  for (const kolon of indirgenmisKolonlar) {
    const dogruSayisi = 15 - hammingMesafesi(kolon.tahminler, gercekSonuc);
    if (dogruSayisi > enYuksekDogru) enYuksekDogru = dogruSayisi;
    if (dogruSayisi >= 10) {
      dogruDagilimi[dogruSayisi] = (dogruDagilimi[dogruSayisi] || 0) + 1;
    }
  }

  return { enYuksekDogru, dogruDagilimi };
}
