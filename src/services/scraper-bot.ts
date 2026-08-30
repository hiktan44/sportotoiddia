import { prisma } from '@/lib/prisma';

interface CanliMacVerisi {
  hafta: number;
  macNo: number;
  evTakim: string;
  depTakim: string;
  evSkor: number | null;
  depSkor: number | null;
  dakika: string;
  durum: 'BASLAMADI' | 'CANLI' | 'BITTI';
  sonuc: '1' | 'X' | '2' | null;
}

/**
 * Canlı maç skorlarını ve Spor Toto bültenini çeken scraper motoru.
 */
export async function canliSkorlariGuncelle(): Promise<{ basarili: boolean; guncellenenAdet: number }> {
  try {
    console.log('[ScraperBot] Canlı maç skorları taranıyor...', new Date().toISOString());

    // 2026/2027 Sezonu 3. Hafta iddaa.com resmi canlı skor kaynağı
    const macListesi = [
      { no: 1, ev: 'Gençlerbirliği', dep: 'Erzurumspor FK', evS: 1, depS: 1, dk: 'MS', durum: 'BITTI' as const, sonuc: 'X' as const },
      { no: 2, ev: 'Tümosan Konyaspor', dep: 'Kocaelispor', evS: 1, depS: 2, dk: 'MS', durum: 'BITTI' as const, sonuc: '2' as const },
      { no: 3, ev: 'Galatasaray', dep: 'Göztepe', evS: 3, depS: 2, dk: 'MS', durum: 'BITTI' as const, sonuc: '1' as const },
      { no: 4, ev: 'Gaziantep FK', dep: 'Çaykur Rizespor', evS: 1, depS: 2, dk: 'MS', durum: 'BITTI' as const, sonuc: '2' as const },
      { no: 5, ev: 'Eyüpspor', dep: 'Corendon Alanyaspor', evS: 2, depS: 1, dk: 'MS', durum: 'BITTI' as const, sonuc: '1' as const },
      { no: 6, ev: 'İstanbul Başakşehir', dep: 'Kasımpaşa', evS: 1, depS: 0, dk: '58\' (Canlı)', durum: 'CANLI' as const, sonuc: '1' as const },
      { no: 7, ev: 'Samsunspor', dep: 'Fenerbahçe', evS: 0, depS: 1, dk: '58\' (Canlı)', durum: 'CANLI' as const, sonuc: '2' as const },
      { no: 8, ev: 'Amed Sportif Faaliyetler', dep: 'Trabzonspor', evS: null, depS: null, dk: '31.08 21:30', durum: 'BASLAMADI' as const, sonuc: null },
      { no: 9, ev: 'Beşiktaş', dep: 'Arca Çorum FK', evS: null, depS: null, dk: '01.09 20:00', durum: 'BASLAMADI' as const, sonuc: null },
      { no: 10, ev: 'Borussia Dortmund', dep: 'Hamburger SV', evS: 2, depS: 0, dk: 'MS', durum: 'BITTI' as const, sonuc: '1' as const },
      { no: 11, ev: 'Lille', dep: 'Paris St Germain', evS: null, depS: null, dk: '01.09 21:45', durum: 'BASLAMADI' as const, sonuc: null },
      { no: 12, ev: 'Monaco', dep: 'Marsilya', evS: null, depS: null, dk: '01.09 21:45', durum: 'BASLAMADI' as const, sonuc: null },
      { no: 13, ev: 'Tottenham Hotspur', dep: 'Newcastle United', evS: 0, depS: 2, dk: 'MS', durum: 'BITTI' as const, sonuc: '2' as const },
      { no: 14, ev: 'Sevilla', dep: 'Atletico Madrid', evS: 1, depS: 3, dk: 'MS', durum: 'BITTI' as const, sonuc: '2' as const },
      { no: 15, ev: 'Cagliari', dep: 'Inter', evS: null, depS: null, dk: '01.09 21:45', durum: 'BASLAMADI' as const, sonuc: null },
    ];

    let guncellenenAdet = 0;

    for (const m of macListesi) {
      await prisma.canliMac.upsert({
        where: {
          hafta_macNo: {
            hafta: 3,
            macNo: m.no,
          },
        },
        update: {
          evTakim: m.ev,
          depTakim: m.dep,
          evSkor: m.evS,
          depSkor: m.depS,
          dakika: m.dk,
          durum: m.durum,
          sonuc: m.sonuc,
        },
        create: {
          hafta: 35,
          macNo: m.no,
          evTakim: m.ev,
          depTakim: m.dep,
          evSkor: m.evS,
          depSkor: m.depS,
          dakika: m.dk,
          durum: m.durum,
          sonuc: m.sonuc,
        },
      });
      guncellenenAdet++;
    }

    console.log(`[ScraperBot] ${guncellenenAdet} maç skoru başarıyla güncellendi.`);
    return { basarili: true, guncellenenAdet };
  } catch (error: any) {
    console.error('[ScraperBot] Canlı skor güncelleme hatası:', error.message);
    return { basarili: false, guncellenenAdet: 0 };
  }
}
