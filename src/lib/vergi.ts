// =====================================================
// VERGİ HESAPLAMA MOTORU
// =====================================================
// Spor Toto ikramiyesi vergi zinciri:
// Havuz → %20 KDV kesintisi → %7 Şans Oyunları Vergisi kesintisi
// Kazanan kişi → %20 Veraset ve İntikal Vergisi (Muafiyet: 53.339 TL/yıl)

export const VERGI_PARAMETRELERI = {
  kdvOrani: 0.20,           // %20 KDV
  sovOrani: 0.07,           // %7 Şans Oyunları Vergisi (havuzdan)
  verasetOrani: 0.20,       // %20 Veraset ve İntikal Vergisi
  muafiyetSiniri: 53339,    // 2025 yılı muafiyet tutarı (TL)
  kolonBedeli: 10,          // TL
  // Görüntüleme için
  kdvYuzde: 20,
  sovYuzde: 7,
  verasetYuzde: 20,
};

export interface VergiSonuc {
  // Büyük Kupon (tek barkod) senaryosu
  buyukKuponBrutIkramiye: number;
  buyukKuponKDVSonrasi: number;
  buyukKuponSOVSonrasi: number;
  buyukKuponVeraset: number;
  buyukKuponNetGelir: number;

  // 10 TL'lik Bağımsız Kolon senaryosu
  bagimsizKolonSayisi: number;
  bagimsizMuafKolonSayisi: number;  // muafiyet sınırı içinde kalan
  bagimsizVergiKolonSayisi: number; // vergi ödeyen
  bagimsizNetGelir: number;
  bagimsizVergidenKurtarilanTutar: number;

  // Karşılaştırma
  kazanc: number;  // bağımsız - büyük kupon net farkı
  kazancYuzdesi: number;
}

/**
 * İki senaryoyu karşılaştırır:
 * 1. Tüm kolonlar tek büyük kupon olarak (yüksek vergi)
 * 2. Her kolon bağımsız 10 TL'lik kupon (her biri muafiyet sınırından yararlanır)
 */
export function vergiHesapla(
  toplamHavuz: number,         // İkramiye havuzu (TL)
  galibiKolonSayisi: number,   // Kazanan kolon adedi
  toplamKolonSayisi: number    // Toplam oynanmış kolon (10 TL baz)
): VergiSonuc {
  const { kdvOrani, sovOrani, verasetOrani, muafiyetSiniri, kolonBedeli } = VERGI_PARAMETRELERI;

  // Kolon başına düşen ikramiye
  const kolonBasinaIkramiye = toplamHavuz / galibiKolonSayisi;

  // --------------------------------------------------------
  // SENARYO 1: Büyük Kupon (Tek Barkod)
  // --------------------------------------------------------
  const buyukKuponBrutIkramiye = kolonBasinaIkramiye * galibiKolonSayisi;
  const buyukKuponKDVSonrasi = buyukKuponBrutIkramiye * (1 - kdvOrani);
  const buyukKuponSOVSonrasi = buyukKuponKDVSonrasi * (1 - sovOrani);
  // Tek barkod = tek veraset vergisi muafiyeti
  const buyukKuponMuafTutar = Math.min(buyukKuponSOVSonrasi, muafiyetSiniri);
  const buyukKuponVergiKonusu = Math.max(0, buyukKuponSOVSonrasi - buyukKuponMuafTutar);
  const buyukKuponVeraset = buyukKuponVergiKonusu * verasetOrani;
  const buyukKuponNetGelir = buyukKuponSOVSonrasi - buyukKuponVeraset;

  // --------------------------------------------------------
  // SENARYO 2: Bağımsız 10 TL Kolonlar
  // --------------------------------------------------------
  // Her 10 TL'lik kolon ayrı ayrı muafiyet sınırına tabidir!
  let bagimsizNetGelirToplam = 0;
  let muafKolonSayisi = 0;
  let vergiKolonSayisi = 0;

  for (let i = 0; i < galibiKolonSayisi; i++) {
    // Her kolon kendi kazancı için muafiyeti kullanır
    const kolonIkramiyesi = kolonBasinaIkramiye;
    const kdvSonrasi = kolonIkramiyesi * (1 - kdvOrani);
    const sovSonrasi = kdvSonrasi * (1 - sovOrani);

    const muaf = Math.min(sovSonrasi, muafiyetSiniri);
    const vergiKonusu = Math.max(0, sovSonrasi - muaf);
    const veraset = vergiKonusu * verasetOrani;
    const netGelir = sovSonrasi - veraset;

    bagimsizNetGelirToplam += netGelir;

    if (vergiKonusu === 0) muafKolonSayisi++;
    else vergiKolonSayisi++;
  }

  const bagimsizVergidenKurtarilanTutar = bagimsizNetGelirToplam - buyukKuponNetGelir;
  const kazancYuzdesi = buyukKuponNetGelir > 0
    ? ((bagimsizNetGelirToplam - buyukKuponNetGelir) / buyukKuponNetGelir) * 100
    : 0;

  return {
    buyukKuponBrutIkramiye,
    buyukKuponKDVSonrasi,
    buyukKuponSOVSonrasi,
    buyukKuponVeraset,
    buyukKuponNetGelir,
    bagimsizKolonSayisi: galibiKolonSayisi,
    bagimsizMuafKolonSayisi: muafKolonSayisi,
    bagimsizVergiKolonSayisi: vergiKolonSayisi,
    bagimsizNetGelir: bagimsizNetGelirToplam,
    bagimsizVergidenKurtarilanTutar,
    kazanc: bagimsizNetGelirToplam - buyukKuponNetGelir,
    kazancYuzdesi,
  };
}

// =====================================================
// ORTAK KASA KAZANÇ DAĞILIMI
// =====================================================
export interface KasaUye {
  id: string;
  ad: string;
  katkiTL: number;  // Katkı miktarı (TL)
}

export interface KasaDagilim {
  uyeId: string;
  uyeAd: string;
  katkiTL: number;
  payOrani: number;       // 0-1 arası
  netKazanc: number;      // TL
}

export function kasaDagilimHesapla(
  uyeler: KasaUye[],
  toplamNetKazanc: number
): KasaDagilim[] {
  const toplamKatki = uyeler.reduce((sum, u) => sum + u.katkiTL, 0);

  return uyeler.map((uye) => {
    const payOrani = toplamKatki > 0 ? uye.katkiTL / toplamKatki : 0;
    return {
      uyeId: uye.id,
      uyeAd: uye.ad,
      katkiTL: uye.katkiTL,
      payOrani,
      netKazanc: toplamNetKazanc * payOrani,
    };
  });
}

// =====================================================
// PARA BİÇİMLENDİRME
// =====================================================
export function tlBicimlendir(tutar: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tutar);
}

export function yuzdeFormat(oran: number): string {
  return `%${oran.toFixed(1)}`;
}
