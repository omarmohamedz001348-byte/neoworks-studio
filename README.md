# Neoworks

The website for Neoworks, an independent game studio. It shows upcoming and released games and hosts the community forums. The creator account (`neoworks`) can manage the games list in a Studio and publish changes with **Save changes**. An assistant called Neo answers questions about releases and helps people find their way around the forums.

## Features
- **Home**: hero section, countdown to the next launch, release ticker, latest threads.
- **Games** (`/games`): Upcoming and Released tabs.
- **Forums** (`/forums`, `/forums/:id`): boards, threads, replies.
- **Sign in** (`/login`): players sign in to post. The `neoworks` account opens the Studio.
- **Studio** (`/studio`): add or remove games and switch their status, then save or discard the draft.
- **Neo**: the "Ask Neo" assistant, available on every page.

## Tech
React 19, React Router 7, Vite and TypeScript. Plain CSS with custom properties. Deployed on Netlify.

## Run locally
```bash
npm install
netlify dev   # or: npm run dev
```

## Roadmap
This first version stores data in the browser and uses placeholder sign-in. Next up are saving games and forum posts in Netlify Database, real accounts with Netlify Identity, and running Neo on a model through Netlify AI Gateway. See [PLAN.md](PLAN.md).
