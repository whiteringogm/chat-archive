const CACHE="seishi-v81-persona-records-1",FILES=["./","./index.html","./style.css","./browser.css","./app.js","./archive-sync.mjs","./sync-core.mjs","./diary-cloud.js","./asset-links.js","./asset-links-ui.js","./diary-candidates-v74.js","./chat-ui-v75.js","./manifest.json","./icon.svg","./notion-images.html","./notion-images.css","./notion-images-core.mjs","./notion-images-ui.mjs","./notion-images.html?v=3","./notion-images.css?v=3","./notion-images-core.mjs?v=3","./notion-images-ui.mjs?v=3"];
const PUBLIC_FILES = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE)
    .then((cache) => cache.addAll(FILES))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key.startsWith("seishi-") && key !== CACHE)
      .map((key) => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  // Never intercept authenticated requests, Notion API traffic, or image bytes.
  // Only the explicit public app shell may be served from this worker's cache.
  if (event.request.method !== "GET" || event.request.headers.has("Authorization") ||
      !PUBLIC_FILES.has(event.request.url)) return;
  event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request))
    .then(cached => cached || fetch(event.request)));
});
