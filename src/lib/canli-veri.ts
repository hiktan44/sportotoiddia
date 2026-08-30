import type { MacSecim } from './kombinasyon';

export interface CanliMacDurum {
  macNo: number;
  evTakim: string;
  depTakim: string;
  evSkor: number | null;
  depSkor: number | null;
  dakika: string;
  durum: 'BASLAMADI' | 'CANLI' | 'BITTI';
  sonuc: MacSecim | null;
}

// 2026/2027 3. Hafta Gerçekleşen ve Güncel Canlı Skorlar
export const GUNCEL_CANLI_SKORLAR: CanliMacDurum[] = [
  { macNo: 1, evTakim: 'Gençlerbirliği', depTakim: 'Erzurumspor FK', evSkor: 1, depSkor: 1, dakika: 'MS', durum: 'BITTI', sonuc: 'X' },
  { macNo: 2, evTakim: 'Tümosan Konyaspor', depTakim: 'Kocaelispor', evSkor: 1, depSkor: 2, dakika: 'MS', durum: 'BITTI', sonuc: '2' },
  { macNo: 3, evTakim: 'Galatasaray', depTakim: 'Göztepe', evSkor: 3, depSkor: 2, dakika: 'MS', durum: 'BITTI', sonuc: '1' },
  { macNo: 4, evTakim: 'Gaziantep FK', depTakim: 'Çaykur Rizespor', evSkor: 1, depSkor: 1, dakika: 'MS', durum: 'BITTI', sonuc: 'X' },
  { macNo: 5, evTakim: 'Eyüpspor', depTakim: 'Corendon Alanyaspor', evSkor: 2, depSkor: 1, dakika: 'MS', durum: 'BITTI', sonuc: '1' },
  { macNo: 6, evTakim: 'İstanbul Başakşehir', depTakim: 'Kasımpaşa', evSkor: 1, depSkor: 0, dakika: 'MS', durum: 'BITTI', sonuc: '1' },
  { macNo: 7, evTakim: 'Samsunspor', depTakim: 'Fenerbahçe', evSkor: 0, depSkor: 1, dakika: 'MS', durum: 'BITTI', sonuc: '2' },
  { macNo: 8, evTakim: 'Amed Sportif Faaliyetler', depTakim: 'Trabzonspor', evSkor: null, depSkor: null, dakika: '31.08 21:30', durum: 'BASLAMADI', sonuc: null },
  { macNo: 9, evTakim: 'Beşiktaş', depTakim: 'Arca Çorum FK', evSkor: null, depSkor: null, dakika: '01.09 20:00', durum: 'BASLAMADI', sonuc: null },
  { macNo: 10, evTakim: 'Borussia Dortmund', depTakim: 'Hamburger SV', evSkor: 2, depSkor: 0, dakika: 'MS', durum: 'BITTI', sonuc: '1' },
  { macNo: 11, evTakim: 'Lille', depTakim: 'Paris St Germain', evSkor: null, depSkor: null, dakika: '01.09 21:45', durum: 'BASLAMADI', sonuc: null },
  { macNo: 12, evTakim: 'Monaco', depTakim: 'Marsilya', evSkor: null, depSkor: null, dakika: '01.09 21:45', durum: 'BASLAMADI', sonuc: null },
  { macNo: 13, evTakim: 'Tottenham Hotspur', depTakim: 'Newcastle United', evSkor: 0, depSkor: 2, dakika: 'MS', durum: 'BITTI', sonuc: '2' },
  { macNo: 14, evTakim: 'Sevilla', depTakim: 'Atletico Madrid', evSkor: 1, depSkor: 3, dakika: 'MS', durum: 'BITTI', sonuc: '2' },
  { macNo: 15, evTakim: 'Cagliari', depTakim: 'Inter', evSkor: null, depSkor: null, dakika: '01.09 21:45', durum: 'BASLAMADI', sonuc: null },
];
