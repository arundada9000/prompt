# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project uses loose semantic versioning.

## [Unreleased]

### Added
- Development workflow requirements section (12 items) so generated prompts tell the assistant to create a rules file, follow the plan, commit per meaningful task, and keep the tracker updated.
- Developer watermark and signature line in the generated prompt, footer credit, and a developer console message.
- Standalone SEO pages: `journal/` (10 articles, each with Article structured data), `journal/index.html` (Blog structured data), and `guide/` with HowTo structured data.
- Custom `404.html` and `offline.html` pages with on-brand copy, and service worker offline navigation fallback.
- Social `og-image.png` (1200x630) and absolute Open Graph / canonical URLs for the production domain.
- Repository documentation: README, LICENSE, CONTRIBUTING, SECURITY, CODE OF CONDUCT, CHANGELOG, and `docs/` (architecture, development, deployment, SEO, privacy).
- `vercel.json` deployment configuration (no-cache service worker, clean URLs, 404 fallback).
- `css/pages.css` shared stylesheet for long-form pages.

### Changed
- Journal content expanded from 3 to 10 articles.
- Journal modal cards now link to full static articles instead of rendering only inline.
- Fixed journal modal failing to load because `window.Content` is undefined for a top-level `const` binding (now resolved lexically).
- Titles and Open Graph metadata rewritten to remove em dashes (colon separator).

## [1.1.0] - 2026-09-10

### Added
- PWA support: manifest, service worker with zero-dependency offline strategy, generated icons (192, 512, maskable, apple-touch), install button.
- SEO/AEO/GEO metadata: title, description, canonical, Open Graph, Twitter cards, and JSON-LD structured data.
- Robots and sitemap files.
- Sidebar section checkboxes with "select all" per section and live counts.
- Expanded keyboard shortcuts and an in-app quick reference (`?`).
- Factory presets (4 built-in starters) with one-click load, delete, and JSON export/import.
- Journal, quick guide, and welcome onboarding modals.
- "## Output" section in the generated prompt.
- Prompts-generated counter in the footer.
- Generated prompt now enforces a no-em-dash no-emoji quality bar.
- Search now covers dropdown and free-text items too.

## [1.0.0] - 2026-07-01

### Added
- Initial version: development prompt builder with 13 requirement sections, live preview, light/dark theme toggle, full-text search, and fullscreen editor.