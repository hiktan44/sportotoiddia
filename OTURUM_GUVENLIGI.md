# SporToto oturum güvenliği — F62

`JWT_SECRET` kaynak kodundaki sabit değere dönmez. Node sunucusu açılırken harici anahtarın en az 32 UTF-8 baytı olduğu doğrulanır; eksik veya kısa anahtar başlangıcı durdurur. Bu sınır tek başına rastgelelik sağlamaz: gerçek ortam için kriptografik rastgele bir anahtar üretin; CI ve derleme örneklerini üretimde kullanmayın.

Yeni JWT'ler HS256 algoritması, uygulama kimliği, hedef, süre ve oturum sürümüyle doğrulanır. `AUTH_TOKEN_VERSION` varsayılanı `1` olur. Anahtar değiştirmek veya sürümü artırmak önceki tokenları reddeder. Yeni token biçimine geçiş de mevcut kullanıcıların yeniden girişini gerektirir.

API ve sunucu oturumu hesap kaydını her kullanımda okur. Rol ve e-posta güncel kayıt üzerinden döner; silinen hesap reddedilir. Kupon API'si kullanıcı deposu okunamıyorsa 503 verir ve kupon işlemini başlatmaz. GET/DELETE sahiplik filtreleri korunur; POST'ta gövdeden başka kullanıcı kimliği kabul edilmez.

## Anahtarı değiştirme

Güvenilir kendi terminalinizde `openssl rand -hex 32` ile yeni anahtar üretin. Çıktıyı sohbete, GitHub'a veya rapora koymadan Coolify'ın gizli `JWT_SECRET` ortam alanına girin. Bütün kopyalarda aynı anahtarı kullanın ve dağıtımı tamamlayın. Sonra yeni girişin çalıştığını, eski tokenın reddedildiğini ayrı test hesabında doğrulayın. Acil tüm oturum iptali için `AUTH_TOKEN_VERSION` değerini yeni bir değere yükseltip bütün kopyaları dağıtın. Logout bu pakette yalnız tarayıcı çerezini siler; tek bir çalınmış tokenın iptali için ayrıca hesap bazlı oturum sürümü gerekir.

## Test sınırı

`npm run test:auth`, gerçek jsonwebtoken imzasını ve Next rota yanıtlarını kurgusal kayıtlarla çalıştırır. Eksik/zayıf anahtar, anahtar/sürüm değişimi, süresi geçmiş/yanlış imzalı token, yanlış algoritma/hedef, bozuk kimlik, güncel rol, silinen hesap, depo hatası ve kupon sahipliği kapsanır. Gerçek Prisma vakası yalnız localhost üzerindeki ayrı `codex_sportoto_test` veritabanında geçici şema kullanır. `SPORTOTO_TEST_DATABASE_URL` CI içinde zorunludur; yerelde yoksa bu vaka atlanır.

Üretim anahtarı değiştirilmedi; gerçek hesap, kupon, bahis, skor sağlayıcısı veya ödeme kullanılmadı. Coolify dağıtımı ve canlı doğrulama bekliyor.
