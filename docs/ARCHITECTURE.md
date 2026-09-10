# Architecture

Prompt Architect is a zero-dependency, offline-first, single-page web application. This document describes how the pieces fit together.

## At a glance

```text
index.html
  |-- css/     design tokens and component stylesheets
  |-- js/      feature definitions + logic modules
  |-- icons/   inline SVG sprite + generated PWA icons
  |-- manifest.json / sw.js / 404.html / offline.html
  |-- journal/ and guide/   generated static SEO pages
  `-- og-image.png / vercel.json / docs/
```

There is no framework, no bundler, and no build step. The browser runs the same files that live in the repository.

## Script architecture

Scripts share one global scope and load in a strict order (see `index.html`):

| File | Responsibility |
| --- | --- |
| `features.js` | Requirement sections: checkbox items, dropdowns, free text, conditional visibility rules. |
| `state.js` | The single source of truth: selections, dropdowns, texts, custom sections, presets, history, undo/redo, and URL hash serialization. |
| `presets.js` | Four built-in factory presets plus standalone export/import helpers. |
| `content.js` | Journal articles and the guide data (also the input for the static page generator). |
| `prompt-builder.js` | Pure functions that assemble the prompt text, export formats, and paste-and-match import. |
| `renderer.js` | All DOM rendering: sidebar, cards, nav, updates. Exposes `Renderer`. |
| `interactions.js` | Scroll spy and active-section highlighting. |
| `circular-nav.js` | Mobile gesture navigation (double-tap, swipes, radial menu). |
| `app.js` | Boot sequence, event wiring, keyboard shortcuts, PWA install flow, modals, search. |

## Data flow

```text
user input  ->  State (localStorage)  ->  State events ->  Renderer  ->  DOM
                    |
                    v
              PromptBuilder.build(...)  ->  preview pane  ->  export / copy
```

State is the only writer of authoritative data. Components read from State and re-render on the `selectionchange` and `statechange` custom events. Undo/redo snapshots the relevant State slices before each mutating operation.

## Persistence

Everything lives in `localStorage` under the `pa-` prefix:

- `pa-selected` selections map
- `pa-dropdowns`, `pa-texts` detail values
- `pa-custom-sections` user-added sections
- `pa-presets` saved presets
- `pa-history` last 20 generated prompts, `pa-undo` / `pa-redo` last 50 steps
- `pa-theme`, `pa-generated-count`, `pa-seen-welcome`, `pa-presets-seeded-v1` misc flags

The URL hash (`#t=PWA&n=...&dd=framework=react&s=...`) round-trips a full configuration so any state is shareable as a link.

## Offline strategy

`sw.js` precaches the app shell, all CSS/JS, both custom error pages, and all journal/guide pages. Navigation requests fall back to `offline.html`, and unregistered assets request from the network first. Shipping assets are not cached at runtime to avoid privacy surprises.

## Static page generation

`tools/build-pages.js` reads `js/content.js`, evals it in Node, and emits the standalone SEO pages (`journal/` and `guide/`) with canonical URLs, Open Graph tags, and JSON-LD structured data (Blog, Article, HowTo). The generated pages share `css/pages.css`. Regenerate with `node tools/build-pages.js` whenever journal or guide content changes.

## Rendering model

Section cards are built once per section type (checkbox, dropdown, text) from `features.js`. Conditional sections (`showWhen`) are hidden by default and revealed only when the governing control matches, so unwanted requirements never reach the prompt.

## Generated prompt shape

`PromptBuilder.build` composes the selected sections in a fixed order:

```text
Project -> Core instruction -> Project quality -> Design system ->
Tech stack -> Responsiveness -> Pages & states -> ... -> Development workflow
-> Global instructions -> Quality bar -> Developer profile -> Output
```

Because order is fixed, the output is predictable and diff-friendly across runs.