// Her tetiklendiğinde sevgiline bir su hatırlatması yollar.
// GitHub Actions bunu zamanında otomatik çalıştırır.

import webpush from "web-push";
import fs from "fs";

/* ============================================================
   ✏️ DEĞİŞTİR: Bildirim mesajları (rastgele biri gönderilir)
   ============================================================ */
const MESAJLAR = [
  { title: "Su Vakti 💧", body: "Bir bardak su içmeyi unutma" },
  { title: "Susadın mı? ", body: "Hadi biraz su iç" },
  { title: "Minik hatırlatma ", body: "Su iç lütfen" }, 
  { title: "Hey !", body: "Sağlığın için bir bardak su zamanı" },
  { title: "Aklıma geldi de ", body: "Bu arada... su içtin mi?" }
];

// ✏️ DEĞİŞTİR (opsiyonel): Bildirimde büyük fotoğraf göstermek istersen
// senin su içerken fotoğrafının İNTERNETTEKİ linkini buraya koy (https ile).
// DİKKAT: Buraya konan foto herkese açık bir linkte olmak zorundadır (gizli kalmaz).
// Gizlilik için boş bırak; o zaman bildirimde sadece yazı görünür (önerilen).
const FOTO_URL = "";

// --- aşağısını değiştirmen gerekmez ---
const PUBLIC = process.env.VAPID_PUBLIC;
const PRIVATE = process.env.VAPID_PRIVATE;
const MAIL = process.env.VAPID_MAIL || "mailto:ornek@ornek.com";

if (!PUBLIC || !PRIVATE) {
  console.error("VAPID anahtarları eksik (GitHub Secrets'a ekle).");
  process.exit(1);
}
webpush.setVapidDetails(MAIL, PUBLIC, PRIVATE);

let sub;
try {
  sub = JSON.parse(fs.readFileSync("subscription.json", "utf8"));
} catch (e) {
  console.error("subscription.json okunamadı. Uygulamadan kopyaladığını yapıştırdın mı?");
  process.exit(1);
}

const m = MESAJLAR[Math.floor(Math.random() * MESAJLAR.length)];
const payload = JSON.stringify({ ...m, image: FOTO_URL || undefined });

try {
  await webpush.sendNotification(sub, payload, {
    urgency: "high",   // Apple'a "bunu hemen ilet" der; gecikmeyi azaltır
    TTL: 1800          // 30 dk içinde iletilemezse düşsün (geç gelmesindense hiç gelmesin)
  });
  console.log("Bildirim gönderildi:", m.body);
} catch (err) {
  console.error("Gönderim hatası:", err.statusCode, err.body || err.message);
  if (err.statusCode === 410 || err.statusCode === 404) {
    console.error("⚠️ Abonelik geçersiz. Uygulamadan YENİ abonelik kopyalayıp subscription.json'a yapıştır.");
  }
  process.exit(1);
}
