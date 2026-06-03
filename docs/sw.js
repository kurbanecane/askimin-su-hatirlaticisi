// Servis çalışanı — bildirimleri telefon kilitliyken bile gösterir.
// Burayı değiştirmene gerek yok.

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

// Sunucudan push geldiğinde
self.addEventListener("push", event => {
  let data = { title: "Su Vakti 💧", body: "Bir bardak su içmeyi unutma 🤍" };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (e) {}

  const options = {
    body: data.body,
    icon: data.icon || "icons/icon-192.png",
    badge: "icons/icon-192.png",
    image: data.image || undefined,   // SENİN su içerken fotoğrafın (büyük görsel) buraya gelebilir
    vibrate: [120, 60, 120],
    tag: "su-hatirlatma",
    renotify: true,
    data: { url: "./" }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Bildirime dokununca uygulamayı aç
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});
