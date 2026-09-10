/* Prompt Architect service worker */
const CACHE = "prompt-architect-v2";
const PRECACHE = [
  "./",
  "./index.html",
  "./404.html",
  "./offline.html",
  "./manifest.json",
  "./journal/",
  "./journal/index.html",
  "./journal/write-prompts-that-get-better-output.html",
  "./journal/the-checklists-behind-a-production-grade-build.html",
  "./journal/from-checklist-to-spec-exporting-for-different-ai-tools.html",
  "./journal/prompt-security-your-first-layer-of-defense.html",
  "./journal/performance-requirements-models-actually-follow.html",
  "./journal/accessibility-built-into-the-prompt.html",
  "./journal/designing-a-design-system-with-ai.html",
  "./journal/pwa-thinking-outside-the-tab.html",
  "./journal/seo-and-generative-engine-optimization.html",
  "./journal/version-control-for-your-prompts.html",
  "./guide/",
  "./guide/index.html",
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
  "./css/pages.css",
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
  "./icons/pwa/apple-touch-icon.png",
  "./og-image.png"
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

  const isNavigate = request.mode === "navigate";

  // Icons: cache first, no network dependency
  if (url.pathname.endsWith(".png") || url.pathname.endsWith(".svg")) {
    event.respondWith(caches.match(request).then((hit) => hit || caches.match("./icons/icons.svg")));
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
      }).catch(() => {
        return caches.match(isNavigate ? "./offline.html" : "./404.html");
      });
    })
  );
});