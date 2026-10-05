# Neoworks roadmap

Neoworks is a game studio site with a games catalog, community forums, a creator Studio for the `neoworks` account, and Neo, an AI assistant. The work is split into small milestones, and each one leaves the site working.

## 1. Product surface ✅
- Branded landing page with a next-launch countdown, a release ticker, the latest forum threads, and an intro to Neo.
- Games page with Upcoming and Released tabs.
- Forums with boards, a thread list, thread pages, new threads and replies.
- Studio for `@neoworks`: add games, remove them, switch them between upcoming and released, and **Save changes** or **Discard**.
- Neo assistant panel that answers questions using live site data (local rules for now).
- All stub data lives in `src/data/fixtures.ts`. Changes are kept in the browser through `src/store.tsx`.

## 2. Games in Netlify Database
- Drizzle schema for `games` in `db/schema.ts`, using `@netlify/database`.
- `GET /api/games` (public) and `PUT /api/games` (creator only), which saves the whole Studio draft in one transaction.
- Seed the database with the games from the fixtures. Point the store at the API, and keep the draft and save flow on the client.

## 3. Real accounts with Netlify Identity
- Replace the placeholder sign-in with `@netlify/identity`: signup, login and password reset.
- Give the `neoworks` user an `admin` role. Check that role on the server for the games write endpoint and for forum moderation.
- Protect `/studio` and remove the preview sign-in button.

## 4. Forums in Netlify Database
- Tables for `threads` and `replies`, with the author taken from the Identity user.
- API routes to list, create, reply, pin and delete. Only the creator can post in Announcements, pin threads, or delete them.
- Pagination and basic rate limiting on posting.

## 5. Neo powered by AI Gateway
- A Netlify Function that streams answers from a model through Netlify AI Gateway.
- Ground each answer in the current games list and recent thread titles, using a system prompt and tool calls.
- Keep the current rule-based answers as a fallback.

## 6. Polish
- Game detail pages with screenshots stored in Netlify Blobs and served through the Image CDN.
- Search across the forums, and notifications for replies.
- Creator notes on the Studio save history.
