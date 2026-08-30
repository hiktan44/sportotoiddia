'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Mac, MacSecim, MacTipi } from '@/lib/kombinasyon';
import { kolonSayisiHesapla, maliyetHesapla } from '@/lib/kombinasyon';
import type { FiltreAyarlari } from '@/lib/filtreler';
import { varsayilanFiltreler } from '@/lib/filtreler';

const KOLON_BEDELI = 10;

// ============================================================
// 2026/2027 SEZONU — 3. HAFTA (30.08.2026 – 02.09.2026)
// Kaynak: sportoto.gov.tr & iddaa / nesine bülteni
// ============================================================
export const GUNCEL_LISTE = {
  hafta: 3,
  tarihAralik: '30.08.2026 – 02.09.2026',
  guncellenmeTarihi: '30.08.2026 21:00',
};

function baslangicMaclar(): Mac[] {
  const macVerileri: { t1: string; t2: string; tarih: string; lig: string; tip: MacTipi; secimler: MacSecim[] }[] = [
    { t1: 'Eyüpspor',           t2: 'Alanyaspor',         tarih: '30.08 19:00', lig: 'Süper Lig',   tip: 'cift',  secimler: ['1', 'X'] },
    { t1: 'Başakşehir',         t2: 'Kasımpaşa',          tarih: '30.08 21:30', lig: 'Süper Lig',   tip: 'banko', secimler: ['1'] },
    { t1: 'Samsunspor',         t2: 'Fenerbahçe',         tarih: '30.08 21:30', lig: 'Süper Lig',   tip: 'cift',  secimler: ['X', '2'] },
    { t1: 'Amed Sportif',       t2: 'Trabzonspor',        tarih: '31.08 21:30', lig: 'Süper Lig',   tip: 'banko', secimler: ['2'] },
    { t1: 'Beşiktaş',           t2: 'Çorum FK',           tarih: '31.08 21:30', lig: 'Süper Lig',   tip: 'banko', secimler: ['1'] },
    { t1: 'Galatasaray',        t2: 'Kayserispor',        tarih: '31.08 19:00', lig: 'Süper Lig',   tip: 'banko', secimler: ['1'] },
    { t1: 'Konyaspor',          t2: 'Antalyaspor',        tarih: '31.08 19:00', lig: 'Süper Lig',   tip: 'cift',  secimler: ['1', 'X'] },
    { t1: 'Rizespor',           t2: 'Göztepe',            tarih: '01.09 20:00', lig: 'Süper Lig',   tip: 'tek',   secimler: ['1'] },
    { t1: 'Sivasspor',          t2: 'Gaziantep FK',       tarih: '01.09 20:00', lig: 'Süper Lig',   tip: 'cift',  secimler: ['1', 'X'] },
    { t1: 'Arsenal',            t2: 'Brighton',           tarih: '31.08 14:30', lig: 'Premier Lig', tip: 'banko', secimler: ['1'] },
    { t1: 'Manchester United',  t2: 'Liverpool',          tarih: '01.09 18:00', lig: 'Premier Lig', tip: 'cift',  secimler: ['X', '2'] },
    { t1: 'Juventus',           t2: 'Roma',               tarih: '01.09 21:45', lig: 'Serie A',     tip: 'cift',  secimler: ['1', 'X'] },
    { t1: 'Lazio',              t2: 'Milan',              tarih: '31.08 21:45', lig: 'Serie A',     tip: 'cift',  secimler: ['1', '2'] },
    { t1: 'Real Madrid',        t2: 'Real Betis',         tarih: '01.09 22:30', lig: 'La Liga',     tip: 'banko', secimler: ['1'] },
    { t1: 'Bayern Münih',       t2: 'Freiburg',           tarih: '01.09 18:30', lig: 'Bundesliga',  tip: 'banko', secimler: ['1'] },
  ];

  return macVerileri.map((m, i) => ({
    id: i + 1,
    takim1: m.t1,
    takim2: m.t2,
    tarih: m.tarih,
    lig: m.lig,
    secimler: m.secimler,
    tip: m.tip,
  }));
}

interface KuponStore {
  // Maç verileri
  maclar: Mac[];
  setMaclar: (maclar: Mac[]) => void;
  macSecimGuncelle: (macId: number, secim: MacSecim, aktif: boolean) => void;
  macTipiGuncelle: (macId: number, tip: MacTipi) => void;
  takimGuncelle: (macId: number, takim1: string, takim2: string) => void;

  // Hesaplama
  kolonSayisi: number;
  maliyet: number;
  
  // Formül
  aktifFormul: '15-garantili' | '14-garantili' | '13-garantili' | '12-garantili' | null;
  setAktifFormul: (f: KuponStore['aktifFormul']) => void;

  // Filtreler
  filtreler: FiltreAyarlari;
  filtreGuncelle: <K extends keyof FiltreAyarlari>(alan: K, deger: FiltreAyarlari[K]) => void;
  filtreleriSifirla: () => void;
  filtreAktif: boolean;

  // Ortak Kasa
  kasaUyeleri: { id: string; ad: string; katkiTL: number }[];
  kasaUyesiEkle: (ad: string, katkiTL: number) => void;
  kasaUyesiSil: (id: string) => void;
  kasaUyesiGuncelle: (id: string, alan: 'ad' | 'katkiTL', deger: string | number) => void;
}

export const useKuponStore = create<KuponStore>()(
  persist(
    (set, get) => ({
      maclar: baslangicMaclar(),
      
      setMaclar: (maclar) => {
        const kolonSayisi = kolonSayisiHesapla(maclar);
        set({ maclar, kolonSayisi, maliyet: maliyetHesapla(kolonSayisi, KOLON_BEDELI) });
      },

      macSecimGuncelle: (macId, secim, aktif) => {
        const maclar = get().maclar.map((mac) => {
          if (mac.id !== macId) return mac;
          let yeniSecimler: MacSecim[];
          if (mac.tip === 'banko') {
            yeniSecimler = aktif ? [secim] : [];
          } else if (mac.tip === 'tek') {
            yeniSecimler = aktif ? [secim] : [];
          } else {
            if (aktif) {
              yeniSecimler = mac.secimler.includes(secim) ? mac.secimler : [...mac.secimler, secim];
            } else {
              yeniSecimler = mac.secimler.filter((s) => s !== secim);
              if (yeniSecimler.length === 0) yeniSecimler = [secim];
            }
          }
          return { ...mac, secimler: yeniSecimler as MacSecim[] };
        });
        const kolonSayisi = kolonSayisiHesapla(maclar);
        set({ maclar, kolonSayisi, maliyet: maliyetHesapla(kolonSayisi, KOLON_BEDELI) });
      },

      macTipiGuncelle: (macId, tip) => {
        const maclar = get().maclar.map((mac) => {
          if (mac.id !== macId) return mac;
          let secimler = mac.secimler;
          if (tip === 'banko') secimler = [mac.secimler[0] ?? '1'];
          else if (tip === 'tek' && secimler.length > 1) secimler = [secimler[0]];
          return { ...mac, tip, secimler };
        });
        const kolonSayisi = kolonSayisiHesapla(maclar);
        set({ maclar, kolonSayisi, maliyet: maliyetHesapla(kolonSayisi, KOLON_BEDELI) });
      },

      takimGuncelle: (macId, takim1, takim2) => {
        set({
          maclar: get().maclar.map((mac) =>
            mac.id === macId ? { ...mac, takim1, takim2 } : mac
          ),
        });
      },

      kolonSayisi: kolonSayisiHesapla(baslangicMaclar()),
      maliyet: maliyetHesapla(kolonSayisiHesapla(baslangicMaclar()), KOLON_BEDELI),

      aktifFormul: null,
      setAktifFormul: (f) => set({ aktifFormul: f }),

      filtreler: varsayilanFiltreler(),
      filtreGuncelle: (alan, deger) => {
        const yeni = { ...get().filtreler, [alan]: deger };
        const aktif = Object.values(yeni).some(
          (v) => v !== null && v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
        );
        set({ filtreler: yeni, filtreAktif: aktif });
      },
      filtreleriSifirla: () => set({ filtreler: varsayilanFiltreler(), filtreAktif: false }),
      filtreAktif: false,

      kasaUyeleri: [],
      kasaUyesiEkle: (ad, katkiTL) => {
        const yeni = { id: `${Date.now()}`, ad, katkiTL };
        set({ kasaUyeleri: [...get().kasaUyeleri, yeni] });
      },
      kasaUyesiSil: (id) => set({ kasaUyeleri: get().kasaUyeleri.filter((u) => u.id !== id) }),
      kasaUyesiGuncelle: (id, alan, deger) => {
        set({
          kasaUyeleri: get().kasaUyeleri.map((u) =>
            u.id === id ? { ...u, [alan]: deger } : u
          ),
        });
      },
    }),
    {
      name: 'sportoto_kupon_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
