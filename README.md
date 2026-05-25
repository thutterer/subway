# Subway Notes

Offline-first PWA note-taking app with support for plain notes and task lists.

## Stack

- **Lit 3** + `@lit-labs/router` — web components, no framework
- **Dexie** + **dexie-cloud-addon** — IndexedDB wrapper with cloud sync
- **TypeScript** — strict mode, type-checked via `tsc`
- **Vite** — dev server and bundler
- **vite-plugin-pwa** — service worker + manifest at build time

## Setup

```bash
npm install
npm run dev      # start dev server with HMR
npm run build    # production build + PWA service worker
npm run preview  # serve the production build locally
```

## Type checking

```bash
npx tsc --noEmit
```

Vite/esbuild handles transpilation; `tsc` is for checking only.

## Deploy

Push to `main` — GitHub Actions builds and deploys to GitHub Pages at `thutterer.github.io/subway/`.
