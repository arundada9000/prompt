# Deployment

Prompt Architect is static and deploys anywhere static files can be served. This document covers the recommended Vercel setup, the don'ts, and a manual fallback.

## Deploy on Vercel (recommended)

The repository ships with `vercel.json` in the root, so a standard Vercel project using the repository works with zero configuration:

```bash
npm i -g vercel
vercel --prod
```

### What vercel.json does

| Concern | Setting |
| --- | --- |
| Cache for `sw.js` | `no-cache, no-store, must-revalidate` (service workers must update promptly) |
| Cache for `manifest.json` and HTML | `no-cache, no-store, must-revalidate` |
| Cache for `og-image.png` | `public, max-age=86400` |
| URLs | `cleanUrls: true`, no trailing slashes |
| Unknown routes | `404.html` (custom, on-brand) |

### Vercel ignores (optional)

Add a `.vercelignore` if you do not want the source tooling in the deployment:

```text
tools/
docs/
*.md
```

Nothing in the running app depends on those files, so pruning them is safe and keeps the deployment small. If you prune them, the service worker precache list must not reference them (it does not).

## Domain and SEO

- Update the canonical, Open Graph, and sitemap URLs to the production origin. The repository uses `https://sajiloprompt.vercel.app`. If you host elsewhere, replace this value in `index.html`, `sitemap.xml`, `robots.txt`, `journal/*`, and `guide/*` (the generator in `tools/build-pages.js` hardcodes it in one place, so regenerate pages after editing).
- `robots.txt` points at `/sitemap.xml`, which lists every journal article and the guide.

## Manual hosting

Any static host works:

```bash
npm run build   # does not exist; there is no build step
```

There is no build step. Copy the repository contents to the docroot and serve. Ensure `index.html` is the directory index, and map unknown paths to `404.html` if your host supports redirects or rewrites.

## Verify after deploy

1. `curl -I <origin>/sw.js` returns `no-cache`.
2. `<origin>/some/runtime/404` returns the custom 404 page, not the host default.
3. Load the page, open DevTools, tick "Offline", and reload. The app shell plus `offline.html` must appear.
4. Install the app (Chrome or Edge) and confirm the manifest icons resolve from the production origin.