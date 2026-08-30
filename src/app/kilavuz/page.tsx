'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, ChevronDown, ChevronRight, CheckCircle,
  Trophy, Filter, Calculator, Users, Zap, AlertTriangle,
  Star, ArrowRight, HelpCircle, TrendingDown, DollarSign,
  Info, Target, Lightbulb, Play, Award
} from 'lucide-react';

// ─── Adım verisi ────────────────────────────────────────────────

const adimlar = [
  {
    id: 1,
    baslik: 'Platform Nedir? Ne İşe Yarar?',
    ikon: <BookOpen size={24} />,
    renk: '#818cf8',
    bgRenk: 'rgba(99, 102, 241, 0.1)',
    ozet: 'Spor Toto oynuyorsanız bu platformu neden kullanmalısınız?',
    icerik: (
      <div className="space-y-6">
        <div
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ color: '#f87171', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                Sorun: 1 Kolon = 10 TL oldu
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
                Eskiden 50 kuruş olan kolon bedeli, artık <strong style={{ color: '#f87171' }}>10 TL</strong>'dir.
                Bu 20 katlık bir artış demek! Örneğin 9 maçı çifte geçerseniz (1 X 2 seçerseniz)
                3⁹ = <strong>19.683 kolon</strong> × 10 TL = <strong style={{ color: '#f87171' }}>196.830 TL</strong> ödersiniz.
                Bu bir servet!
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                Çözüm: Bu platform tam da bunu çözüyor
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
                Platform iki şekilde size yardımcı olur:
              </p>
              <ul style={{ color: '#94a3b8', fontSize: 14, lineHeight: 2, marginTop: 8, paddingLeft: 16 }}>
                <li>✅ <strong style={{ color: '#e2e8f0' }}>Garantili Formüller:</strong> 15 maçlığına kupon yaparsınız ama gerçekte çok daha az kolon öderek 12, 13, 14 veya 15 doğru yapma garantisi alırsınız.</li>
                <li>✅ <strong style={{ color: '#e2e8f0' }}>Akıllı Filtreler:</strong> "Bu maçta 1-1 beraberlik çıkmaz" gibi tahminlerinizi sisteme girersiniz; sistem o kolonları atar, maliyet düşer.</li>
                <li>✅ <strong style={{ color: '#e2e8f0' }}>Vergi Avantajı:</strong> 10 TL'lik ayrı kolonlar 53.339 TL'nin altında kaldığı için veraset vergisinden muaf sayılır. Büyük kupon oynarken bu avantajı kaçırırsınız.</li>
                <li>✅ <strong style={{ color: '#e2e8f0' }}>Ortak Kasa:</strong> Arkadaşlarınızla katkı paylaşıp kazancı otomatik bölebilirsiniz.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Maliyet Tasarrufu', deger: '%70-80', renk: '#10b981', ikon: <TrendingDown size={18} /> },
            { label: 'Garanti Oranı', deger: '12-15 Doğru', renk: '#818cf8', ikon: <Trophy size={18} /> },
            { label: 'Vergi Muafiyet', deger: '53.339 TL', renk: '#f59e0b', ikon: <DollarSign size={18} /> },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl text-center"
              style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
            >
              <div style={{ color: item.renk, marginBottom: 6 }}>{item.ikon}</div>
              <div style={{ color: item.renk, fontSize: 20, fontWeight: 900 }}>{item.deger}</div>
              <div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  {
    id: 2,
    baslik: 'Adım 1: Kupon Oluştur Sayfası',
    ikon: <Trophy size={24} />,
    renk: '#f59e0b',
    bgRenk: 'rgba(245, 158, 11, 0.1)',
    ozet: 'Maçlara tahmin girmek — en temel işlem buradan başlar',
    icerik: (
      <div className="space-y-5">
        <div
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
        >
          <Info size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            Spor Toto'da 15 maç için 1 (Ev sahibi kazanır), X (Beraberlik) veya 2 (Deplasman kazanır) tahminini yaparsınız.
            Bu sayfada her maç için tahminlerinizi seçebilirsiniz.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              no: 'A',
              baslik: 'Her maç için maç tipini seçin',
              renk: '#f59e0b',
              aciklama: 'Her maçın solunda 3 buton vardır:',
              liste: [
                '⭐ BANKO: Bu maçın sonucundan yüzde yüz eminsiniz. Tek seçim yaparsınız. Kolonları azaltır, maliyet düşer.',
                'TEK: Bu maçtan biri için tahmin yapacaksınız. Sadece 1 tahmin seçebilirsiniz.',
                'ÇFT (Çifte): Bu maçtan emin değilsiniz. Örneğin hem 1 hem X\'i seçersiniz — iki sonuca da oynarsınız.',
              ],
              ipucu: '💡 Strateji: En emin olduğunuz maçları BANKO yapın. "1 veya X çıkar" dediğiniz maçları ÇFT seçin. Bu maliyeti dramatik şekilde düşürür.',
            },
            {
              no: 'B',
              baslik: '1 / X / 2 tahminini seçin',
              renk: '#818cf8',
              aciklama: 'Her maç kartının sağında mavi butonlar vardır:',
              liste: [
                '1: Ev sahibi takım kazanır',
                'X: Maç berabere biter',
                '2: Deplasman (misafir) takım kazanır',
                'BANKO/TEK modunda sadece 1 seçim, ÇFT modunda birden fazla seçim yapabilirsiniz.',
              ],
              ipucu: '💡 Örnek: Fenerbahçe–Beşiktaş maçında Fenerbahçe\'in kazanacağını düşünüyorsanız "1" seçin. Emin değilseniz "1" ve "X"i birlikte seçin (ÇFT modunda).',
            },
            {
              no: 'C',
              baslik: 'Sağ paneldeki maliyeti takip edin',
              renk: '#10b981',
              aciklama: 'Sağ taraftaki panel anlık maliyet gösterir:',
              liste: [
                'Yeşil renk: 2.000 TL altı — Makul maliyet',
                'Sarı renk: 2.000–10.000 TL arası — Dikkat!',
                'Kırmızı renk: 10.000 TL üzeri — Çok yüksek, formül kullanın!',
              ],
              ipucu: '💡 Maliyet çok yüksekse "Garantili Formül Seç" bölümünden 12-Garantili formülü seçin. Bu, maliyeti %70-80 düşürür.',
            },
          ].map((madde) => (
            <div
              key={madde.no}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.12)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `rgba(99,102,241,0.1)`,
                    color: madde.renk,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900, flexShrink: 0,
                  }}
                >
                  {madde.no}
                </div>
                <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{madde.baslik}</h4>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>{madde.aciklama}</p>
              <ul style={{ paddingLeft: 16, fontSize: 13, lineHeight: 2 }}>
                {madde.liste.map((item, i) => (
                  <li key={i} style={{ color: '#cbd5e1' }}>{item}</li>
                ))}
              </ul>
              <div
                className="mt-3 p-3 rounded-xl"
                style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)' }}
              >
                <p style={{ color: '#6ee7b7', fontSize: 12, lineHeight: 1.6 }}>{madde.ipucu}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
        >
          <div style={{ color: '#818cf8', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>📌 Garantili Formüller (Sağ Panelde)</div>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
            Sağ panelde "Garantili Formül Seç" bölümü var. Buradan bir formül seçtiğinizde sistem,
            mevcut tahminlerinizi matematiksel olarak en az kolonla en yüksek başarı garantisini verecek şekilde düzenler.
            Örneğin <strong style={{ color: '#f59e0b' }}>14-Garantili</strong> seçerseniz: 15 maçın 14'ünü doğru tutturduğunuzda
            mutlaka en az bir ikramiyeli kolonunuz olur.
          </p>
        </div>

        <div className="flex justify-end">
          <Link href="/kupon">
            <button
              className="flex items-center gap-2"
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                padding: '10px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Kupon Oluşturucuya Git <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </div>
    ),
  },

  {
    id: 3,
    baslik: 'Adım 2: Filtreler Sayfası',
    ikon: <Filter size={24} />,
    renk: '#10b981',
    bgRenk: 'rgba(16, 185, 129, 0.1)',
    ozet: '15 akıllı filtre — imkânsız kolonları ayıklayın, maliyeti düşürün',
    icerik: (
      <div className="space-y-5">
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
        >
          <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            Düşünün: 1.000 kolon ürettiniz ama bunların %30'u zaten imkânsız kombinasyonlar içeriyor.
            Filtreler bu "israf kolonları" sistematik olarak eler ve maliyetinizi 300 kolon-3.000 TL azaltır.
          </p>
        </div>

        <div className="grid gap-3">
          {[
            {
              baslik: '🎯 Sürpriz Sınırı',
              aciklama: 'Bir kuponda en fazla kaç "sürpriz" sonuç (düşük ihtimalli tahmin) olabileceğini sınırlayın. Gerçekçi değerlendirme: genellikle 15 maçta 3-4 sürpriz sonuç çıkar. Bu filtre, 7-8 sürpriz içeren imkânsız kombinasyonları atar.',
              renk: '#818cf8',
            },
            {
              baslik: '⚽ Üst/Alt Sınırı',
              aciklama: '"Ev sahibi kazanır" (1) sonucu kaç maçtan fazla çıkamaz? Bunu sınırlayın. Örneğin "en fazla 6 maç ev sahibi kazanabilir" derseniz, 8 ev sahibi galibiyeti içeren kombinasyonları atar.',
              renk: '#10b981',
            },
            {
              baslik: '📊 Denge Filtresi',
              aciklama: 'Kuponda 1, X ve 2 sonuçları arasında mantıklı bir denge olsun. %100 sadece 1 içeren veya %100 sadece 2 içeren kombinasyonlar gerçekçi değil — bunlar elenir.',
              renk: '#f59e0b',
            },
            {
              baslik: '🔢 Art Arda Aynı Sonuç',
              aciklama: 'Gerçekte 5 maç üst üste aynı sonuç çıkması nadirdir. Bu filtre, "1,1,1,1,1,1" gibi 6 üst üste aynı sonuç içeren kombinasyonları atar.',
              renk: '#22d3ee',
            },
          ].map((filtre) => (
            <div
              key={filtre.baslik}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.12)' }}
            >
              <div style={{ color: filtre.renk, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{filtre.baslik}</div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>{filtre.aciklama}</p>
            </div>
          ))}
        </div>

        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
        >
          <div style={{ color: '#818cf8', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🔧 Nasıl Kullanılır?</div>
          <ol style={{ color: '#94a3b8', fontSize: 13, lineHeight: 2, paddingLeft: 16 }}>
            <li>1. Önce "Kupon Oluştur" sayfasında maçlarınızı seçin.</li>
            <li>2. "Filtrelere Git" butonuna tıklayın (veya üst menüden Filtreler).</li>
            <li>3. Filtreleri açın/kapatın, değerleri ayarlayın.</li>
            <li>4. Sağ panelde anlık olarak kaç kolonun filtrelendiğini görün.</li>
            <li>5. Maliyet düşüşünü gerçek zamanlı takip edin.</li>
          </ol>
        </div>

        <div className="flex justify-end">
          <Link href="/filtreler">
            <button
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                padding: '10px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Filtreler Sayfasına Git <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </div>
    ),
  },

  {
    id: 4,
    baslik: 'Adım 3: Vergi Hesaplama',
    ikon: <Calculator size={24} />,
    renk: '#a78bfa',
    bgRenk: 'rgba(167, 139, 250, 0.1)',
    ozet: 'İkramiye kazanırsanız ne kadar vergi ödersiniz? Önceden hesaplayın',
    icerik: (
      <div className="space-y-5">
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
        >
          <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            Spor Toto'da kazanılan ikramiyeler vergiye tabi. Ama küçük miktarlar muaf!
            Bu sayfa kazancınızdan ne kadar kesildiğini net olarak gösterir.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              baslik: 'KDV (%18)',
              aciklama: 'Her kupon bedeli üzerinden alınır. Zaten bilet fiyatına dahil, siz ödüyor olursunuz ama farkında olmayabilirsiniz.',
              renk: '#f87171',
            },
            {
              baslik: 'Şans Oyunları Vergisi (%10)',
              aciklama: 'Kazandığınız ikramiyeden Milli Piyango İdaresi direkt keser. 1.000 TL kazandıysanız 100 TL kesilir, elinize 900 TL geçer.',
              renk: '#fb923c',
            },
            {
              baslik: 'Veraset ve İntikal Vergisi Muafiyeti',
              aciklama: 'Çok önemli: Tek bir bilet/kolon başına kazanç 53.339 TL\'nin (2024 yılı limiti) altında kalırsa bu vergi ALINMAZ. İşte 10 TL\'lik bağımsız kolonların zekici avantajı bu! Tek büyük bilet yerine 100 ayrı 10 TL\'lik kolon oynarsanız her biri muafiyet limitinin çok altında kalır.',
              renk: '#34d399',
            },
          ].map((vergi) => (
            <div
              key={vergi.baslik}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.12)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: vergi.renk, flexShrink: 0,
                  }}
                />
                <div style={{ color: vergi.renk, fontWeight: 700, fontSize: 14 }}>{vergi.baslik}</div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>{vergi.aciklama}</p>
            </div>
          ))}
        </div>

        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
        >
          <div style={{ color: '#34d399', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🧮 Hesap Makinesi Nasıl Kullanılır?</div>
          <ol style={{ color: '#94a3b8', fontSize: 13, lineHeight: 2, paddingLeft: 16 }}>
            <li>1. "İkramiye Tutarı" alanına kazandığınızı düşündüğünüz miktarı girin.</li>
            <li>2. "Büyük kupon" mu yoksa "10 TL bağımsız" mı oynadığınızı seçin.</li>
            <li>3. Sistem otomatik hesaplar: ne kadar vergi kesilir, elinize ne geçer.</li>
            <li>4. İki senaryo arasındaki farkı yan yana görürsünüz.</li>
          </ol>
        </div>

        <div className="flex justify-end">
          <Link href="/hesaplama">
            <button
              style={{
                background: 'rgba(167, 139, 250, 0.1)',
                border: '1px solid rgba(167, 139, 250, 0.4)',
                color: '#a78bfa',
                padding: '10px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Vergi Hesaplamasına Git <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </div>
    ),
  },

  {
    id: 5,
    baslik: 'Adım 4: Ortak Kasa',
    ikon: <Users size={24} />,
    renk: '#22d3ee',
    bgRenk: 'rgba(34, 211, 238, 0.1)',
    ozet: 'Arkadaşlarınızla birleşin, maliyeti paylaşın, kazancı adil bölün',
    icerik: (
      <div className="space-y-5">
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}
        >
          <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
            5 arkadaş olup her biri 200 TL koyarsa toplam 1.000 TL ile 100 kolon oynayabilirsiniz.
            Tek başınıza 100 kolon oynamak yerine riskleri dağıtmış olursunuz.
            Birisi kazanırsa herkes kazanır — kazanç katkı payına göre otomatik hesaplanır.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              baslik: '👤 Üye Ekle',
              aciklama: 'Ad ve katkı tutarını girin. Sistem otomatik pay yüzdesini hesaplar. Sınırsız üye ekleyebilirsiniz.',
            },
            {
              baslik: '💰 Katkı Yönetimi',
              aciklama: 'Birisi daha fazla, birisi daha az koyabilir. Örneğin Ali 500 TL, Ayşe 300 TL, Mehmet 200 TL koymuşsa toplam 1.000 TL. Ali %50, Ayşe %30, Mehmet %20 pay alır.',
            },
            {
              baslik: '🏆 Kazanç Simülatörü',
              aciklama: '"Bu kupon 50.000 TL kazanırsa herkes ne alır?" sorusunu anında cevaplayın. Vergi çıktıktan sonraki net kazancı her üye için ayrı ayrı hesaplar.',
            },
          ].map((madde) => (
            <div
              key={madde.baslik}
              className="p-4 rounded-xl"
              style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.12)' }}
            >
              <div style={{ color: '#22d3ee', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{madde.baslik}</div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>{madde.aciklama}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Link href="/ortak-kupon">
            <button
              style={{
                background: 'rgba(34, 211, 238, 0.08)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                color: '#22d3ee',
                padding: '10px 20px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Ortak Kasa'ya Git <ArrowRight size={15} />
            </button>
          </Link>
        </div>
      </div>
    ),
  },

  {
    id: 6,
    baslik: 'Örnek Senaryo: Gerçek Kullanım',
    ikon: <Play size={24} />,
    renk: '#f472b6',
    bgRenk: 'rgba(244, 114, 182, 0.1)',
    ozet: 'Basitten karmaşığa, sıfırdan sonuca — eksiksiz bir kullanım örneği',
    icerik: (
      <div className="space-y-4">
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
          Aşağıda Ahmet Bey'in bu platformu nasıl kullandığını adım adım görelim:
        </p>
        {[
          {
            no: '1',
            baslik: 'Maçları değerlendiriyor',
            detay: 'Ahmet Bey, 35. Hafta listesindeki 15 maça bakıyor. Trabzonspor–Galatasaray maçında Galatasaray\'ın çok kuvvetli favori olduğunu düşünüyor → BANKO 2 seçiyor. Fenerbahçe–Beşiktaş derbisinde emin olamıyor → ÇFT 1 ve X seçiyor. Diğer 5 maçı da ÇFT yapıyor. Kalan 8 maçı TEK geçiyor.',
            renk: '#f472b6',
          },
          {
            no: '2',
            baslik: 'Maliyet patlıyor!',
            detay: '5 ÇFT × 8 TEK × 1 BANKO = 5×2 = 32 kombinasyon × 8 TEK maç... toplam 2^5 × 1 = yaklaşık 250 kolon = 2.500 TL. Yüksek ama idare eder.',
            renk: '#f59e0b',
          },
          {
            no: '3',
            baslik: '14-Garantili formülü seçiyor',
            detay: '2.500 TL hâlâ fazla. Sağ panelden "14-Garantili" formülünü seçiyor. Sistem 2.500 TL\'lik 250 kolonu matematiksel olarak 80 kolona → 800 TL\'ye düşürüyor. Ama garanti: 15 maçın 14\'ünü bilirse mutlaka 1 ikramiyeli kolon var!',
            renk: '#10b981',
          },
          {
            no: '4',
            baslik: 'Filtreler ile daha da düşürüyor',
            detay: 'Filtreler sayfasına geçiyor. "Sürpriz sınırı: 3" diye ayarlıyor (15 maçta 3\'ten fazla sürpriz sonuç bence çıkmaz). Bu filtre 800 TL\'yi 560 TL\'ye düşürüyor. Net tasarruf: 1.940 TL!',
            renk: '#818cf8',
          },
          {
            no: '5',
            baslik: 'Arkadaşlarıyla paylaşıyor',
            detay: '560 TL tek başına biraz fazla. Ortak Kasa\'ya gidiyor, 3 arkadaşı ekliyor. Herkes 140 TL koyuyor. Birlikte 56 kolon oynuyorlar. Kazanırlarsa katkı oranında bölüşüyorlar.',
            renk: '#22d3ee',
          },
        ].map((adim) => (
          <div
            key={adim.no}
            className="p-4 rounded-xl flex gap-4"
            style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.12)' }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 10,
                background: `${adim.renk}20`,
                border: `1px solid ${adim.renk}50`,
                color: adim.renk,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, flexShrink: 0,
              }}
            >
              {adim.no}
            </div>
            <div>
              <div style={{ color: adim.renk, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{adim.baslik}</div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>{adim.detay}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },

  {
    id: 7,
    baslik: 'Sık Sorulan Sorular (SSS)',
    ikon: <HelpCircle size={24} />,
    renk: '#34d399',
    bgRenk: 'rgba(52, 211, 153, 0.1)',
    ozet: 'Aklınızdaki soruların cevapları burada',
    icerik: (
      <div className="space-y-3">
        {[
          {
            s: 'Bu platform benim yerime kupon mu oynuyor?',
            c: 'Hayır. Platform bilet satmıyor, oynamıyor. Sadece hangi kombinasyonları oynamanız gerektiğini hesaplar, maliyetleri gösterir. Biletle için yine bayiye gidecek ya da Spor Toto\'nun resmi sitesini kullanacaksınız.',
          },
          {
            s: '12/13/14/15 Garantili ne demek tam olarak?',
            c: 'Örneğin 14-Garantili: 15 maçın 14\'ünü doğru tahmin ettiğinizde sistem garantilemektedir ki o 14 doğruyu içeren en az 1 kombinasyonunuz vardır ve bu kombinasyon ikramiye alır. Tüm maçları bilmek zorunda değilsiniz — 14 tanesini bilmeniz yeterlidir.',
          },
          {
            s: 'Filtreler gerçekten işe yarıyor mu?',
            c: 'Evet, filtreler istatistiksel mantığa dayanıyor. Ancak her maç bağımsız bir olaydır — filtreler olası sonuçları azaltır ama sizi kazanmaya "zorlamaz". Maliyet düşürme konusunda somut ve garantili etkisi vardır.',
          },
          {
            s: 'Verilerini güncel mi? Hangi haftanın listesi var?',
            c: 'Sayfa şu an 35. Hafta listesiyle (04–06 Nisan 2026) yüklü gelir. Takım adlarını "Takım Adı Düzenle" butonu ile dilediğiniz zaman değiştirebilirsiniz. Her hafta yeni liste manuel olarak güncellenir.',
          },
          {
            s: 'Ortak Kasa\'daki veriler kaydediliyor mu?',
            c: 'Hayır, tüm veriler sadece tarayıcınızın belleğinde (session) tutulur. Sayfayı kapattığınızda sıfırlanır. Kalıcı kayıt özelliği henüz eklenmemiştir.',
          },
          {
            s: 'Bu platform güvenilir mi, yasal mı?',
            c: 'Tamamen yasal. Platform yalnızca matematiksel hesaplama yapar. Spor Toto oynamak yasal, bu platform da o temel matematiği hesap makinesi gibi yapar. Para alışverişi yoktur.',
          },
        ].map((sss, i) => (
          <details
            key={i}
            className="group"
            style={{
              background: 'rgba(15, 22, 41, 0.8)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                padding: '14px 18px',
                cursor: 'pointer',
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: 14,
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>❓ {sss.s}</span>
              <ChevronDown size={16} color="#64748b" />
            </summary>
            <div
              style={{
                padding: '0 18px 14px',
                color: '#94a3b8',
                fontSize: 13,
                lineHeight: 1.8,
                borderTop: '1px solid rgba(99,102,241,0.08)',
                paddingTop: 12,
              }}
            >
              {sss.c}
            </div>
          </details>
        ))}
      </div>
    ),
  },

  {
    id: 8,
    baslik: 'Pro İpuçları ve Stratejiler',
    ikon: <Lightbulb size={24} />,
    renk: '#fbbf24',
    bgRenk: 'rgba(251, 191, 36, 0.1)',
    ozet: 'Deneyimlilerin kullandığı gelişmiş yöntemler',
    icerik: (
      <div className="space-y-4">
        {[
          {
            baslik: '🎯 BANKO stratejisi',
            aciklama: 'Haftanın en "emin" 3-4 maçını BANKO yapın. Geri kalan maçları ÇFT yapın. Bu kombinasyon en iyi maliyet/garanti dengesini verir. BANKO seçtiğiniz maçı yanlış yaparsanız tüm kupon çöpe gider — dikkatli seçin!',
            oncelik: 'Başlangıç seviyesi',
            renk: '#10b981',
          },
          {
            baslik: '💡 %70+%30 Stratejisi',
            aciklama: 'Bütçenizin %70\'ini 1 garantili sistem kupona, %30\'unu serbest seçimli 1-2 kolona ayırın. Garantili sistem kayıplarınızı sınırlar, serbest kolon ise büyük kazanç şansınızı korur.',
            oncelik: 'Orta seviye',
            renk: '#818cf8',
          },
          {
            baslik: '🔄 Grup Rotasyonu',
            aciklama: 'Ortak kasada 10 kişilik bir grup kurun. Her hafta 1 kişi "kasa sorumlusu" olup kuponu hazırlar. Kazanç direkt paylaşılır. Maliyeti 10\'a böldüğünüzde çok daha fazla kolon oynayabilirsiniz.',
            oncelik: 'İleri seviye',
            renk: '#f59e0b',
          },
          {
            baslik: '📊 Filtre Kombinasyonu',
            aciklama: 'Tek bir filtre %10 düşürür. 3-4 filtreyi aynı anda kullanırsanız toplam %40-60 düşüş görebilirsiniz. Ancak çok agresif filtrelerle garantili sistemin gücünü azaltmayın.',
            oncelik: 'İleri seviye',
            renk: '#22d3ee',
          },
        ].map((ipucu) => (
          <div
            key={ipucu.baslik}
            className="p-5 rounded-2xl"
            style={{ background: 'rgba(15, 22, 41, 0.8)', border: '1px solid rgba(99, 102, 241, 0.12)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>{ipucu.baslik}</div>
              <span
                style={{
                  background: `${ipucu.renk}15`,
                  border: `1px solid ${ipucu.renk}40`,
                  color: ipucu.renk,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6,
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                {ipucu.oncelik}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>{ipucu.aciklama}</p>
          </div>
        ))}
      </div>
    ),
  },
];

// ─── Ana Bileşen ─────────────────────────────────────────────────

export default function KilavuzSayfasi() {
  const [acikAdim, setAcikAdim] = useState<number | null>(1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Başlık */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 mb-4"
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '6px 16px',
            borderRadius: 20,
          }}
        >
          <BookOpen size={14} color="#818cf8" />
          <span style={{ color: '#818cf8', fontSize: 12, fontWeight: 700 }}>KULLANIM KILAVUZU</span>
        </div>
        <h1 className="text-4xl font-black text-slate-100 mb-4">
          Nasıl Kullanılır?
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
          Hiç Spor Toto oynamadıysanız bile bu kılavuzu okuyarak
          <strong style={{ color: '#818cf8' }}> 10 TL'lik kupon maliyetlerini</strong> nasıl
          <strong style={{ color: '#10b981' }}> %70-80 düşüreceğinizi</strong> öğreneceksiniz.
        </p>

        {/* Hızlı gezinti */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            { label: '🎯 Platform Nedir', id: 1 },
            { label: '🎟 Kupon Oluştur', id: 2 },
            { label: '🔽 Filtreler', id: 3 },
            { label: '💸 Vergi Hesap', id: 4 },
            { label: '👥 Ortak Kasa', id: 5 },
            { label: '📖 Örnek', id: 6 },
            { label: '❓ SSS', id: 7 },
            { label: '💡 Pro İpuçları', id: 8 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAcikAdim(item.id)}
              style={{
                background: acikAdim === item.id
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(15, 22, 41, 0.8)',
                border: `1px solid ${acikAdim === item.id ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.15)'}`,
                color: acikAdim === item.id ? '#818cf8' : '#64748b',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* İçerik Bölümleri */}
      <div className="space-y-3">
        {adimlar.map((adim) => {
          const acik = acikAdim === adim.id;
          return (
            <div
              key={adim.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: acik ? 'rgba(15, 22, 41, 0.95)' : 'rgba(10, 14, 26, 0.8)',
                border: `1px solid ${acik ? 'rgba(99,102,241,0.35)' : 'rgba(99,102,241,0.1)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Başlık Butonu */}
              <button
                onClick={() => setAcikAdim(acik ? null : adim.id)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: adim.bgRenk,
                    color: adim.renk,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {adim.ikon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 16 }}>{adim.baslik}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 3 }}>{adim.ozet}</div>
                </div>
                <div style={{ color: '#4b5563', flexShrink: 0 }}>
                  {acik ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </button>

              {/* İçerik */}
              {acik && (
                <div style={{ padding: '0 20px 20px' }}>
                  <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 20 }}>
                    {adim.icerik}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alt CTA */}
      <div
        className="mt-10 p-6 rounded-2xl text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}
      >
        <Award size={32} color="#818cf8" style={{ margin: '0 auto 12px' }} />
        <h2 className="text-xl font-bold text-slate-100 mb-2">Hazır mısınız?</h2>
        <p className="text-slate-400 text-sm mb-6" style={{ lineHeight: 1.7 }}>
          Bu kılavuzu okudunuz — artık platforma başlayabilirsiniz.
          İlk adım: Kupon Oluştur sayfasına gidin ve 15 maç için tahminlerinizi girin.
        </p>
        <Link href="/kupon">
          <button
            style={{
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              color: 'white',
              padding: '12px 32px',
              borderRadius: 12,
              border: 'none',
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Zap size={18} /> Hemen Başla
          </button>
        </Link>
      </div>
    </div>
  );
}
