const CACHE_NAME = "train-patrol-v17";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./bundle.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];
const CDN_ASSETS = [
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).then(() =>
        Promise.allSettled(CDN_ASSETS.map((u) => cache.add(u)))
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isAppShell = ["./", "./index.html", "./bundle.js"].some((a) =>
    url.pathname.endsWith(a.replace("./", "/"))
  );
  const isStaticAsset =
    ["./manifest.json", "./icon-192.png", "./icon-512.png"].some((a) =>
      url.pathname.endsWith(a.replace("./", "/"))
    ) || CDN_ASSETS.includes(event.request.url);

  if (isAppShell) {
    // Network-first: always try to get the freshest app code when online,
    // so a redeploy shows up immediately instead of being stuck on an old
    // cached bundle. Only fall back to cache when actually offline.
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (isStaticAsset) {
    // These rarely change, so cache-first is fine (and faster).
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // Everything else (e.g. Firebase data requests): network-first, cache as fallback.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
