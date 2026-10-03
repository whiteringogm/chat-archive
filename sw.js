const CACHE="seishi-v76-notion-links-2",FILES=["./","./index.html","./style.css","./browser.css","./app.js","./asset-links.js","./asset-links-ui.js","./diary-candidates-v74.js","./chat-ui-v75.js","./manifest.json","./icon.svg"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE)
    .then((cache) => cache.addAll(FILES))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key !== CACHE)
      .map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
