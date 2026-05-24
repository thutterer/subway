# Subway Notes — Agent Guide

## Commands
| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Bundle + PWA service worker via `vite-plugin-pwa` |
| `npm run preview` | Serve the production build locally |
| `npx tsc --noEmit` | Type-check (Vite/esbuild handles transpilation; `tsc` is for checking only) |

No test, lint, or formatter commands exist.

## Stack
- **Lit 3** with `@lit-labs/router` — LitElement web components, no JSX
- **Dexie** — IndexedDB wrapper, single `SubwayNotes` DB with one table: `notes: ++id, text, pending_sync, created_at`
- **Vite** — bundler/ dev server
- **vite-plugin-pwa** — generates service worker + manifest at build time (zero config, uses defaults)
- **TypeScript** — checked via `tsc --noEmit`; Vite/esbuild handles transpilation at dev/build time

## Project structure
- `index.html` → `/src/app-root.ts` — entrypoint, custom element `<app-root>`
- `src/` — all components, flat layout
- `src/db/db.ts` — Dexie CRUD: `dbFetchAll`, `dbCreateNote`, `dbCreateFoo`, `dbUpdateNote`, `dbDeleteNote`, `dbFetchNoteById`
- `src/assets/` — Silkscreen .woff2 font

## Important quirks
- **Two create functions** in `db.ts`: `dbCreateNote()` (no args, empty text) is unused; `dbCreateFoo(text, type)` is what `new-page.ts` actually calls.
- **Empty `src/fonts/`** directory — the Silkscreen font lives in `src/assets/`, loaded via `@font-face` in `src/index.css`.
- **PWA** is generated at build time only; `vite-plugin-pwa` has no explicit config, so it uses plugin defaults.
- `dbFetchNoteById` exists but is only used in `edit-page.ts`.

## Style conventions
- CSS custom property `--brand-color: wheat` in `src/index.css:root`; `color-scheme: light dark` with a media query for dark mode (`#16171d` background).
- Shadows DOM is used throughout. Events cross shadow boundaries with `bubbles: true, composed: true`.
- Font: `"Silkscreen", monospace` globally.
- No CSS preprocessor or CSS-in-JS — plain `css` tagged template literals in Lit components.
