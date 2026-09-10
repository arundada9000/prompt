/* Prompt Architect service worker */
const CACHE = "prompt-architect-v1";
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/tokens.css",
  "./css/base.css",
  "./css/glass.css",
  "./css/components.css",
  "./css/navbar.css",
  "./css/hero.css",
  "./css/sidebar.css",
  "./css/cards.css",
  "./css/preview.css",
  "./css/circular-nav.css",
  "./css/responsive.css",
  "./css/extras.css",
  "./css/print.css",
  "./js/features.js",
  "./js/state.js",
  "./js/presets.js",
  "./js/content.js",
  "./js/prompt-builder.js",
  "./js/renderer.js",
  "./js/interactions.js",
  "./js/circular-nav.js",
  "./js/app.js",
  "./icons/icons.svg",
  "./icons/pwa/icon-192.png",
  "./icons/pwa/icon-512.png",
  "./icons/pwa/icon-maskable-512.png",
  "./icons/pwa/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith(".png") || url.pathname.endsWith(".svg")) {
    event.respondWith(caches.match(request).then((hit) => hit || caches.match("./icons/" + url.pathname.split("/").slice(-2).join("/"))));
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response && (response.status === 200 || response.type === "opaque")) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});