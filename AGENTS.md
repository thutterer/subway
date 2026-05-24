# Subway Notes — Agent Guide

## Commands
| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Bundle + PWA service worker via `vite-plugin-pwa` |
| `npm run preview` | Serve the production build locally |

No test, lint, typecheck, or formatter commands exist.

## Stack
- **Lit 3** with `@lit-labs/router` — LitElement web components, no JSX
- **Dexie** — IndexedDB wrapper, single `SubwayNotes` DB with one table: `notes: ++id, text, pending_sync, created_at`
- **Vite** — bundler/ dev server
- **vite-plugin-pwa** — generates service worker + manifest at build time (zero config, uses defaults)
- No TypeScript, no build step beyond Vite

## Project structure
- `index.html` → `/src/app-root.js` — entrypoint, custom element `<app-root>`
- `src/` — all components, flat layout
- `src/db/db.js` — Dexie CRUD: `dbFetchAll`, `dbCreateNote`, `dbCreateFoo`, `dbUpdateNote`, `dbDeleteNote`, `dbFetchNoteById`
- `src/assets/` — starter template images/ fonts (Silkscreen .woff2)
- `public/icons.svg` — SVG icon sprite used by `my-element.js`

## Important quirks
- **Dead code** — `my-element.js` (Vite Lit starter template) and `app-note-detail.js` are registered as custom elements but never loaded by the router. Do not add imports from them.
- **Two create functions** in `db.js`: `dbCreateNote()` (no args, empty text) is unused; `dbCreateFoo(text, type)` is what `new-page.js` actually calls.
- **Empty `src/fonts/`** directory — the Silkscreen font lives in `src/assets/`, loaded via `@font-face` in `src/index.css`.
- **PWA** is generated at build time only; `vite-plugin-pwa` has no explicit config, so it uses plugin defaults.
- `dbFetchNoteById` exists but is only used in `edit-page.js`.

## Style conventions
- CSS custom property `--brand-color: wheat` in `src/index.css:root`; `color-scheme: light dark` with a media query for dark mode (`#16171d` background).
- Shadows DOM is used throughout. Events cross shadow boundaries with `bubbles: true, composed: true`.
- Font: `"Silkscreen", monospace` globally.
- No CSS preprocessor or CSS-in-JS — plain `css` tagged template literals in Lit components.
