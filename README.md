# 💧 Su Vakti — Sevgiline Özel Su Hatırlatıcısı

iPhone'da, App Store'a çıkmadan, telefon kilitliyken bile hatırlatma gönderen
sana özel bir uygulama. Mac gerekmez, **tamamen ücretsiz**, tek bir GitHub hesabı yeter.

Mantık şu: Web uygulaması (PWA) "Ana Ekrana Ekle" ile iPhone'a kurulur, GitHub Actions
da belirlediğin saatlerde otomatik bildirim yollar.

---

## 🔒 GİZLİLİK (önemli)

Fotoğraflar **internete YÜKLENMEZ**. Uygulamada fotoğrafa dokununca telefondan seçilir ve
**sadece o telefonda** (tarayıcı hafızasında) saklanır. Yani:
- Repo'yu/siteyi gizli yapmana gerek yok; içinde hiç fotoğraf olmaz, sadece kod olur.
- Sevgilinin fotoğraflarını senden başka kimse göremez, çünkü hiçbir yere gönderilmezler.

Not: GitHub Pages siteleri her zaman herkese açıktır (repo gizli olsa bile yayınlanan sayfa
herkese açık olur). Bu yüzden fotoğrafları siteye koymak yerine telefonda sakladık — en güvenli yol bu.

---

## 🎨 KİŞİSELLEŞTİRME

**Fotoğraflar:** Uygulama telefonda açılınca üstteki profil halkasına ve alttaki küçük foto
kutusuna dokun → telefondan fotoğraf seç. (Üst = sevgilinin fotoğrafı, alt = senin su içerken
fotoğrafın.) Bunları kodda değil, telefonda ayarlıyorsun.

**Yazılar:** `docs/index.html` içindeki `AYARLAR` bölümünden ✏️ işaretli yerler:
hedef (kaç kere), isim, saate göre selamlamalar, tatlı notlar. Bildirim mesajları da
`send.js` içindeki `MESAJLAR` bölümünden değişir. `vapidPublicKey` ise Adım 3'te doldurulacak.

---

## 🚀 KURULUM (sırayla)

### Adım 1 — GitHub'a yükle
1. github.com'da ücretsiz hesap aç.
2. Yeni bir repo oluştur (örn. `su-vakti`), **Public** seç.
3. Bu klasördeki tüm dosyaları repoya yükle (Add file → Upload files, sürükle bırak).

### Adım 2 — Siteyi yayına al (GitHub Pages)
1. Repo'da **Settings → Pages**.
2. "Build and deployment" altında **Source: Deploy from a branch**.
3. Branch: `main`, klasör: **`/docs`** seç, Save.
4. 1-2 dakika sonra adresin hazır olur:
   `https://KULLANICIADIN.github.io/su-vakti/`

### Adım 3 — Bildirim anahtarlarını üret (VAPID)
Bunlar bildirimleri imzalayan gizli anahtarlardır. İki yol:

- **Bilgisayarda Node varsa:** komut satırına yaz:
  `npx web-push generate-vapid-keys`
  Sana bir **Public Key** ve **Private Key** verir.
- **Node yoksa:** internette "vapid key generator" araması yapıp anahtar üretebilirsin
  (anahtarlar tarayıcıda üretilir).

Sonra:
- **Public Key**'i kopyala → `docs/index.html` içindeki `vapidPublicKey: "..."` kısmına yapıştır,
  commit et.
- Repo'da **Settings → Secrets and variables → Actions → New repository secret**:
  - `VAPID_PUBLIC` = public key
  - `VAPID_PRIVATE` = private key
  - `VAPID_MAIL` = `mailto:senin@mailin.com`

### Adım 4 — Telefona kur (sevgilinin iPhone'unda)
1. **Safari**'de siteyi aç (Adım 2'deki adres).
2. Alttaki **Paylaş** ikonu → **Ana Ekrana Ekle**.
3. Ana ekrandaki **yeni ikondan** uygulamayı aç (Safari'den değil!).
4. **"Bildirimlere izin ver"** butonuna bas, izni onayla.
5. Ekranda uzun bir yazı (abonelik) çıkar ve otomatik kopyalanır.

### Adım 5 — Aboneliği sunucuya bağla
1. Adım 4'te kopyalanan yazının tamamını al.
2. Repo'da `subscription.json` dosyasını aç (kalem ikonu ile düzenle),
   içindekini sil, kopyaladığını yapıştır, commit et.

### Adım 6 — Test et
1. Repo'da **Actions** sekmesi → **Su Hatirlatici** → **Run workflow**.
2. Birkaç saniye içinde telefona bildirim düşmeli. 🎉

Bitti! Artık her gün **09:00 – 00:00 arası 2 saatte bir** otomatik hatırlatma gelir.

---

## ⏰ Saatleri değiştirmek
`.github/workflows/reminder.yml` içindeki `cron` satırını düzenle.
Saatler **UTC**'dir; Türkiye saatinden **3 saat çıkar**. Örnek: 10:00 TR = 07 UTC.

## ℹ️ Bilinmesi gerekenler
- iPhone iOS 16.4+ gerekir (sizde iOS 26 var, sorun yok).
- Mutlaka **Ana Ekrana Ekle** ile açılması gerekir; düz Safari sekmesinde bildirim çalışmaz.
- GitHub'ın zamanlanmış görevleri bazen birkaç dakika gecikebilir (normaldir).
- Repo 60 gün hiç dokunulmazsa GitHub zamanlamayı durdurabilir; ara sıra küçük bir
  değişiklik (commit) yaparsan ya da Actions'ı tekrar aktifleştirirsen devam eder.
- `subscription.json` public repoda görünür ama tek başına zararsızdır: bildirim göndermek
  için **VAPID_PRIVATE** anahtarı şart, o da gizli Secrets'ta durur.
