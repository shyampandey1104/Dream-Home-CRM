const CACHE_NAME = "dreamhomes-crm-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
  "/dreamhomes_gold_logo.jpg",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-First for HTML/manifest, Cache-First for static assets
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate" || event.request.url.includes("index.html") || event.request.url.includes("manifest.json")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
