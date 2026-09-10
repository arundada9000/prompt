# Privacy

Promise first, then the boring details.

## The short version

Prompt Architect has no account system, no backend, and no third-party scripts. Nothing you type or select ever leaves your browser. The site works offline because nothing is fetched at runtime except the app's own cached files.

## What is stored

All state is stored locally in your browser via `localStorage`:

| Key | Contents |
| --- | --- |
| `pa-selected` | Your checked requirement boxes |
| `pa-dropdowns` / `pa-texts` | Tech stack and custom text values |
| `pa-custom-sections` | Sections you added yourself |
| `pa-presets` | Your saved presets |
| `pa-history` | The last 20 generated prompts |
| `pa-undo` / `pa-redo` | The last 50 editing steps |
| `pa-theme` | Light/dark preference |
| `pa-generated-count` | A local counter of generated prompts |
| `pa-presets-seeded-v1` / `pa-seen-welcome` | First-run flags |

This data never leaves your device. Clearing site data in your browser removes all of it.

## What is cached

The service worker caches app files (HTML, CSS, JS, icons, images, and the journal/guide pages) so the site works offline. It does not cache, proxy, or even look at content you generate or page requests to other origins. See the fetch handler in `sw.js`: all third-party requests pass straight through.

## What is sent over the network

Nothing, at runtime:

- No analytics.
- No trackers.
- No advertising.
- No beaconing.
- No telemetry.

Deployed static hosting providers may write technical logs (request paths, status codes) as part of normal server operation. No personal identification or prompt contents are involved.

## Removing your data

- Clear "site data" for the origin in your browser's settings.
- Or uninstall the app and clear storage.

Either action erases stored presets, history, and preferences without any server involvement.

## Changes

If behavior ever changes (for example, adding analytics), this file is the page this project promises to update first. A change that adds network traffic is release-blocking and documented in `SECURITY.md`.