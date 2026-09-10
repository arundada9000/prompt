# Development guide

Everything you need to run, change, and verify Prompt Architect locally.

## Requirements

- Node.js 18 or newer (only used for the test harness and the static page generator; the app itself runs anywhere).
- A static server for realistic testing (any will do).

## Run locally

```bash
python -m http.server 8123
# or
npx serve .
```

Open <http://127.0.0.1:8123>.

## Where things live

```text
js/features.js        all requirement sections and controls
js/state.js           state model, presets, history, undo/redo
js/content.js         journal + guide content (single source of truth)
js/prompt-builder.js  prompt assembly and export
js/renderer.js        all DOM rendering
js/app.js             boot, events, shortcuts, PWA, modals
tools/build-pages.js  emits journal/ and guide/ SEO pages
css/tokens.css        the design system, change colors here
```

## Script load order

`index.html` loads scripts in dependency order and they share one scope:

```text
features -> state -> presets -> content -> prompt-builder -> renderer
         -> interactions -> circular-nav -> app
```

Keep it that way when adding modules.

## Add a requirement section

1. Open `js/features.js`.
2. Append an entry with `id`, `title`, `desc`, and `items` arrays.
3. Item shapes: `["id", "Title", "Description"]` (checkbox), `{ type: "dropdown", options: [[value, label, desc]] }`, or `{ type: "text", placeholder }`.
4. Optionally set `showWhen: { field, values }` for a conditional section.
5. Run `node tools/build-pages.js` only if journal/guide content changed (it does not).

The prompt builder and sidebar pick up new sections automatically because they iterate `FEATURES`.

## Add a journal article

1. Append an object to `Content.journal` in `js/content.js` with `slug`, `title`, `tag`, `date`, `minutes`, `description`, `excerpt`, and `body`.
2. Run `node tools/build-pages.js` to regenerate the static pages and update the service worker precache list for the new slug.

Keep the slug URL-safe lowercase with hyphens.

## Tests

There is no test framework on purpose. Verification happens three ways:

1. Syntax: `node --check js/*.js`.
2. Logic: the concatenated harness in `%TEMP%\opencode\make-test.js` stubs `localStorage`, `document`, and `window`, concatenates the real scripts, and asserts on the public APIs. Run it with `node make-test.js && node concatenated-test.js`.
3. Browser: headless Chrome with `--dump-dom`, or the DevTools Protocol smoke test for click-driven flows (for example opening the journal modal).

Add assertions for any bug fix so the harness catches regressions.

## Design rules

- Use only tokens from `css/tokens.css`. No hardcoded colors or spacing.
- No em dashes anywhere in UI copy, docs, or generated prompts.
- No new runtime dependencies. Implement in vanilla JS/CSS.
- No external network calls at runtime.
- Test on a narrow viewport (mobile) and with the service worker offline simulation.