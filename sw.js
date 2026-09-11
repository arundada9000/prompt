/* Prompt Architect service worker */
const CACHE = "prompt-architect-v4";
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
  // Per-entry precache that never fails: a single slow/failed asset must not
  // block activation, or an old service worker could keep running forever.
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => {})));
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.enable(); } catch (e) { /* optional */ }
      }
      await self.clients.claim();
    })()
  );
});

const offlineDocument = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prompt Architect</title></head><body style="font-family:system-ui,sans-serif;padding:2rem;line-height:1.5">You are offline. Reconnect and reload this page.</body></html>';

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigate = request.mode === "navigate";

  const cacheWrite = (req, res) => {
    caches.open(CACHE)
      .then((cache) => cache.put(req, res.clone()))
      .catch(() => { /* cache write failures are non-fatal */ });
  };

  if (isNavigate) {
    // Network-first for page navigations: always fresh when online, cached copy
    // offline. This can never reject a navigation.
    event.respondWith((async () => {
      try {
        let response = null;
        if (event.preloadResponse) {
          try {
            const preloaded = await event.preloadResponse;
            if (preloaded && preloaded.ok) response = preloaded;
          } catch (e) { /* ignore preload failures */ }
        }
        if (!response) response = await fetch(request);
        if (response && response.ok) cacheWrite(request, response);
        return response;
      } catch (err) {
        const cached =
          (await caches.match(request)) ||
          (await caches.match("./offline.html"));
        return (
          cached ||
          new Response(offlineDocument, {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          })
        );
      }
    })());
    return;
  }

  // Non-navigation: cache-first, fall back to network, then a safe fallback.
  event.respondWith((async () => {
    const hit = await caches.match(request);
    if (hit) return hit;
    try {
      const response = await fetch(request);
      if (response && response.ok) cacheWrite(request, response);
      return response;
    } catch (err) {
      const fallback = await caches.match("./404.html");
      return (
        fallback ||
        new Response("", {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        })
      );
    }
  })());
});