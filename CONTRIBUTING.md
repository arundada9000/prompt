# Contributing to Prompt Architect

Thanks for taking the time to contribute. Prompt Architect is a deliberately small, zero-dependency codebase, and every contribution counts.

## Ground rules

- **No em dashes.** Use hyphens, commas, or colons instead. This is a project rule, and it also appears in generated prompts.
- **No new dependencies.** The app ships with zero build step and zero runtime dependencies. If you need a feature, implement it with vanilla JS and CSS.
- **Keep it offline-first.** Anything you add must work with JavaScript disabled? No, it must work with *the network disabled*. localStorage, service worker, no external calls.
- **Respect the design system.** Use the CSS tokens in `css/tokens.css` (iOS HIG palette). Do not hardcode colors or spacing inline.

## Getting started

```bash
git clone https://github.com/arundada9000/prompt.git
cd prompt
python -m http.server 8123
```

Open <http://localhost:8123>. The app is plain HTML/CSS/JS, so there is nothing to install.

## Script load order matters

Scripts are loaded via `<script>` tags in `index.html`. They share one global scope, so order matters:

```text
features.js -> state.js -> presets.js -> content.js -> prompt-builder.js
            -> renderer.js -> interactions.js -> circular-nav.js -> app.js
```

If you add a module, wire it into this chain.

## Testing

There is no test framework. We verify with:

1. `node --check` on every `js/*.js` file.
2. Functional assertions in Node against a concatenated bundle (stubbed `localStorage`/`document`).
3. A headless Chrome pass via `chrome --headless=new --dump-dom` against a local server.

A regression test that reproduces a bug is the fastest way to get a fix merged.

## Commit conventions

- Write clear, descriptive commit messages (imperative mood).
- Commit at meaningful milestones, not huge mixed batches.

## Pull request checklist

- [ ] `node --check` passes for every changed JS file
- [ ] The app still builds nothing and ships with zero new dependencies
- [ ] No em dashes introduced anywhere
- [ ] Tested on a small viewport (mobile) and with the PWA offline simulation

## Code of conduct

Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Found a vulnerability? Follow [SECURITY.md](SECURITY.md), do not open a public issue.