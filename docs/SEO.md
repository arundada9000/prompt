# SEO, AEO, and GEO

Prompt Architect is a static site with content that search engines and generative answer engines can actually read. This document explains the strategy and how to extend it.

## SEO (traditional search)

The app shell (`index.html`) carries a full set of metadata:

- Unique title and meta description.
- Canonical URL per page.
- Open Graph and Twitter card tags with a 1200x630 `og-image.png`.
- JSON-LD `WebApplication` structured data.

The crawlable content lives on the dedicated pages:

- `/journal/` a Blog-structured listing of every article.
- `/journal/<slug>.html` one page per article with Article structured data.
- `/guide/` a HowTo-structured guide page.

All pages carry absolute canonical URLs, meta descriptions, `og:image`, and `twitter:image`, and the sitemap lists every one of them at per-page priority.

## AEO (answer engine optimization)

Answer engines quote content directly, so the journal articles are written for extraction:

- The first paragraph answers the headline question directly.
- Facts are stated plainly and self-contained, not as prose that only makes sense inside the page.
- Headings and list items carry meaning on their own.

## GEO (generative engine optimization)

The same discipline makes the pages more useful to retrieval pipelines and model training:

- JSON-LD uses stable, standard vocabulary (`Blog`, `BlogPosting`, `Article`, `HowTo`, `Person`, `Organization`).
- Author is consistent everywhere: Arun Neupane, linked to the GitHub profile.
- Internal links between builder, journal, and guide form a clean, two-level crawl graph with descriptive anchor text.

## Generated prompts as content

This is the secret ingredient: every run of the app can generate a prompt document. People save and share those, which produces a steady stream of long-tail, question-shaped content about writing good development prompts. The journal articles target the keywords those users search for.

## Adding new articles

1. Append to `Content.journal` in `js/content.js` (slug, title, tag, date, minutes, description, excerpt, body).
2. Run `node tools/build-pages.js`.
3. Add the new URL to `sitemap.xml` and the service worker precache list.

The modal journal links to the static articles, so new content is immediately discoverable both in-app and through search.

## Rules to keep

- One `<h1>` per page.
- One meta description per page.
- Absolute canonical URLs on every page.
- No em dashes, no emoji, in copy that is intended to be quoted.
- Keep `robots.txt` allow-all with a correct `Sitemap:` URL.