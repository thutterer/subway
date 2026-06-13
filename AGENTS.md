# Subway Notes — Agent Guide

## Commands
| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Bundle + PWA service worker via `vite-plugin-pwa` |
| `npm run preview` | Serve the production build locally |
| `npx tsc --noEmit` | Type-check (Vite/esbuild handles transpilation; `tsc` is for checking only) |
| `npx playwright test e2e/` | Run 14 e2e tests (~9s) |

## Stack
- **Lit 3** with `@lit-labs/router` — LitElement web components, no JSX, Shadow DOM
- **Dexie** — IndexedDB wrapper, single `SubwayNotes` DB: `docs` table (`id, created_at`) with version 2 migration from old `notes` table
- **Vite** — bundler/dev server
- **vite-plugin-pwa** — generates service worker + manifest at build time (zero config)
- **TypeScript** — checked via `tsc --noEmit`; Vite/esbuild handles transpilation

## Project structure
- `index.html` → `src/app-root.ts` — entrypoint, custom element `<app-root>`
- `src/` — all components, flat layout
- `src/db/db.ts` — Dexie CRUD: `dbFetchAllDocs`, `dbCreateDoc`, `dbUpdateDoc`, `dbDeleteDoc`
- `src/assets/` — Silkscreen .woff2 font only

## Block-based document model
- `Doc` has `blocks: Block[]`, each block is either `TextBlock` (`{ type: "text", markdown }`), `ListBlock` (`{ type: "list", items: Task[] }`), or `DividerBlock` (`{ type: "divider" }`)
- Display type is derived from the first block: list → "List", everything else → "Note"
- **Migration**: Dexie `version(2).upgrade()` maps old `Note` → `Doc` with one block
- **Block management**: `edit-page.ts` renders an add-block bar (`+ Text`, `+ List`, `+ ---`) and a `[-]` delete button per block (with confirm). All mutations update `this._blocks` immediately and persist via `dbUpdateDoc`.

## Data flow
- **Each component owns its writes.** `edit-page.ts` calls `dbUpdateDoc`/`dbDeleteDoc` directly with `await` for title save, delete, and list changes.
- **`note-item` → `block-changed` → `edit-page._onBlockChanged`** — note-item dispatches keystroke events (fire-and-forget); edit-page updates blocks in DB.
- **`list-item` → `list-changed` → `edit-page._onListChanged`** — local 1-hop event so `edit-page` updates `this._blocks` immediately (avoiding stale data from `liveQuery` latency). `_onListChanged` awaits the write internally.
- **`app-root.ts`** only runs a `liveQuery` subscription for the home-page doc list and a `@navigate` handler for SPA routing. It no longer handles CRUD events.
- **Navigation** is unified via `navigate` custom events (bubbles, composed) with `detail: { path }`. The `@navigate` listener on `<main>` uses `history.pushState` + `router.goto`.

## Dexie Cloud addon
Conditionally loaded in `db.ts` when `VITE_DB_URL` is set. Without it, `db.cloud` is `undefined` and `index-page.ts` guards all cloud access with optional chaining. Schema uses `@id` (cloud) vs `id` (core Dexie). `dbCreateDoc` provides `crypto.randomUUID()` when running without cloud.

## Test patterns
- **14 e2e tests** in `e2e/spec.spec.ts` covering Index, Notes (CRUD, title edit, UI delete), Lists (CRUD, toggle, task delete, progress bar), and Navigation (back-link).
- Each Playwright test gets a fresh browser context (isolated IndexedDB).
- **List toggle/delete tests** use `page.waitForTimeout(300)` to let async IndexedDB writes settle before navigating. This is needed because the `list-item` → `edit-page._onListChanged` write is fire-and-forget from the event system's perspective.

## Style conventions
- CSS custom property `--brand-color: wheat` in `src/index.css:root`; `color-scheme: light dark` with dark mode media query.
- Shadow DOM throughout. Events cross boundaries with `bubbles: true, composed: true`.
- Font: `"Silkscreen", monospace` globally.
- No CSS preprocessor or CSS-in-JS — plain `css` tagged template literals in Lit components.
