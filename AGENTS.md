# AGENTS.md

**Read PLAN.md first.** Milestone 1 (the product surface) is done. Continue with the next unchecked milestone.

## Architecture
- Vite + React 19 single-page app with React Router 7 (`BrowserRouter`). `netlify.toml` rewrites every path to `index.html`.
- `src/data/fixtures.ts`: **all stub data** and domain types (`Game`, `Thread`, `Reply`, forum categories, `CREATOR_USERNAME`). Later milestones replace these with Netlify Database data.
- `src/store.tsx`: a single React context that holds all app state:
  - `games` (published) and `draft` (the Studio working copy). `dirty` compares the two. `saveChanges()` publishes the draft, and `discardChanges()` resets it. A `beforeunload` warning fires while there are unsaved edits.
  - A placeholder session: `signIn` accepts any non-empty username and password. `isCreator` means the username is `neoworks`.
  - Forum threads and replies.
  - Data is kept in `localStorage` (`neoworks:*` keys) for now. Swap this layer for API calls in milestones 2 and 4, and keep the store's interface the same so the pages don't need to change.
- `src/components/Assistant.tsx`: Neo. `answer()` is rule-based over live store data. Milestone 5 replaces it with an AI Gateway function call.
- `src/components/Cover.tsx`: generative CSS cover art. Each game picks a palette with `hue`.
- `src/pages/*`: one file per route.

## Conventions
- Plain CSS in `src/styles.css`, with design tokens in `:root`. Colors: lime `--lime` is the accent, pink `--pink` marks warnings, unsaved changes and new items, amber `--amber` marks upcoming games. Fonts: Unbounded (display), Bricolage Grotesque (body), JetBrains Mono (meta text).
- Use `.reveal` with an inline `animationDelay` for staggered entrances.
- Keep page components self-contained and read state through `useStore()`.
- Use Netlify primitives for persistence (Database for records, Blobs for files, Identity for auth). Never use external services.
