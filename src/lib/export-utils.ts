import * as XLSX from 'xlsx';
import type { Kolon, Mac } from './kombinasyon';

/**
 * Kolonları Nesine / Bilyoner / İddaa / Bayi kupon yatırma formatında TXT olarak hazırlar.
 */
export function kolonlariTxtYap(kolonlar: Kolon[], maclar: Mac[]): string {
  let txt = `=====================================================\n`;
  txt += `SPOR TOTO AI - KUPON VE KOLON LİSTESİ\n`;
  txt += `Toplam Kolon: ${kolonlar.length} Adet | Maliyet: ${kolonlar.length * 10} TL\n`;
  txt += `Tarih: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}\n`;
  txt += `=====================================================\n\n`;

  txt += `MAÇ LİSTESİ:\n`;
  maclar.forEach((m, idx) => {
    txt += `${(idx + 1).toString().padStart(2, ' ')}. ${m.takim1} vs ${m.takim2} (${m.lig || 'Lig'})\n`;
  });
  txt += `\n=====================================================\n`;
  txt += `KOLONLAR:\n`;
  txt += `=====================================================\n`;

  kolonlar.forEach((kolon, idx) => {
    txt += `Kolon ${(idx + 1).toString().padStart(4, ' ')}: ${kolon.tahminler.join(' - ')}\n`;
  });

  return txt;
}

/**
 * Bayi terminali için kompakt (sadece tahmin dizisi) format.
 */
export function bayiFormatTxt(kolonlar: Kolon[]): string {
  return kolonlar.map((k) => k.tahminler.join('')).join('\n');
}

/**
 * Kolonları Excel (.xlsx) dosyası olarak indirir.
 */
export function kolonlariExcelIndir(kolonlar: Kolon[], maclar: Mac[], dosyaAdi = 'sportoto_kolonlar.xlsx') {
  const wb = XLSX.utils.book_new();

  // 1. Sayfa: Kolonlar Tablosu
  const kolonVerileri = kolonlar.map((k, i) => {
    const satir: Record<string, any> = { 'Kolon No': i + 1 };
    k.tahminler.forEach((t, mIdx) => {
      const macBaslik = `${mIdx + 1}. ${maclar[mIdx] ? maclar[mIdx].takim1 + '-' + maclar[mIdx].takim2 : 'Maç ' + (mIdx + 1)}`;
      satir[macBaslik] = t;
    });
    return satir;
  });

  const wsKolonlar = XLSX.utils.json_to_sheet(kolonVerileri);
  XLSX.utils.book_append_sheet(wb, wsKolonlar, 'Kolonlar');

  // 2. Sayfa: Maç Bülteni Özeti
  const macVerileri = maclar.map((m, idx) => ({
    'No': idx + 1,
    'Ev Sahibi': m.takim1,
    'Deplasman': m.takim2,
    'Lig': m.lig || '-',
    'Tarih': m.tarih || '-',
    'Seçilen Tercihler': m.secimler.join(', '),
    'Mod': m.tip.toUpperCase(),
  }));
  const wsMaclar = XLSX.utils.json_to_sheet(macVerileri);
  XLSX.utils.book_append_sheet(wb, wsMaclar, 'Maç Bülteni');

  XLSX.writeFile(wb, dosyaAdi);
}

/**
 * TXT dosyasını tarayıcıdan indirir.
 */
export function txtDosyasiIndir(icerik: string, dosyaAdi = 'sportoto_kolonlar.txt') {
  const blob = new Blob([icerik], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = dosyaAdi;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
