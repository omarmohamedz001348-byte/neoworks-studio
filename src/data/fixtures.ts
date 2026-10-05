// All stubbed data lives here. Later milestones replace these with Netlify Database queries.

export type GameStatus = 'upcoming' | 'released'

export interface Game {
  id: string
  title: string
  tagline: string
  genre: string
  platforms: string[]
  status: GameStatus
  /** ISO date. Release date for released games, target date for upcoming ones. */
  date: string
  /** Index into the cover palette used to draw the CSS cover art. */
  hue: number
}

export interface Reply {
  id: string
  author: string
  body: string
  at: string
}

export interface Thread {
  id: string
  category: ForumCategoryId
  title: string
  author: string
  body: string
  at: string
  pinned?: boolean
  replies: Reply[]
}

export type ForumCategoryId = 'announcements' | 'general' | 'help' | 'feedback' | 'showcase'

export const FORUM_CATEGORIES: { id: ForumCategoryId; name: string; blurb: string }[] = [
  { id: 'announcements', name: 'Announcements', blurb: 'Official news from the Neoworks team.' },
  { id: 'general', name: 'General', blurb: 'Talk about anything Neoworks.' },
  { id: 'help', name: 'Help & Support', blurb: 'Bugs, crashes, install trouble.' },
  { id: 'feedback', name: 'Feedback', blurb: 'Ideas and wishlists for our games.' },
  { id: 'showcase', name: 'Showcase', blurb: 'Clips, builds, fan art, speedruns.' },
]

export const CREATOR_USERNAME = 'neoworks'

export const INITIAL_GAMES: Game[] = [
  {
    id: 'g-voidrunner',
    title: 'Voidrunner',
    tagline: 'A neon roguelite where the city rebuilds itself every run.',
    genre: 'Roguelite',
    platforms: ['PC', 'PS5', 'Xbox'],
    status: 'upcoming',
    date: '2026-12-11',
    hue: 0,
  },
  {
    id: 'g-hollow-signal',
    title: 'Hollow Signal',
    tagline: 'Decode a dead radio network before something answers back.',
    genre: 'Horror / Puzzle',
    platforms: ['PC'],
    status: 'upcoming',
    date: '2027-03-20',
    hue: 3,
  },
  {
    id: 'g-kiln',
    title: 'Kiln & Kingdom',
    tagline: 'Cozy pottery-town builder with a surprisingly deep economy.',
    genre: 'Sim / Builder',
    platforms: ['PC', 'Switch'],
    status: 'upcoming',
    date: '2027-06-01',
    hue: 2,
  },
  {
    id: 'g-gridlock',
    title: 'GRIDLOCK',
    tagline: 'Four-player arena racer. No brakes. Only boost.',
    genre: 'Racing',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    status: 'released',
    date: '2026-05-14',
    hue: 1,
  },
  {
    id: 'g-paper-moons',
    title: 'Paper Moons',
    tagline: 'A hand-folded platformer about a kid who builds the sky.',
    genre: 'Platformer',
    platforms: ['PC', 'Switch'],
    status: 'released',
    date: '2025-11-02',
    hue: 4,
  },
  {
    id: 'g-ironclad',
    title: 'Ironclad Tactics',
    tagline: 'Turn-based mech warfare across a drowned continent.',
    genre: 'Strategy',
    platforms: ['PC'],
    status: 'released',
    date: '2025-02-27',
    hue: 5,
  },
]

export const INITIAL_THREADS: Thread[] = [
  {
    id: 't-1',
    category: 'announcements',
    title: 'Voidrunner release date locked: December 11',
    author: 'neoworks',
    body: 'It is official. Voidrunner launches December 11 on PC, PS5 and Xbox. Wishlist now and drop your questions below — we read every reply.',
    at: '2026-09-28T16:00:00Z',
    pinned: true,
    replies: [
      { id: 'r-1', author: 'pixelwitch', body: 'Finally!! Is there a Switch version planned?', at: '2026-09-28T16:40:00Z' },
      { id: 'r-2', author: 'neoworks', body: 'Not at launch, but we are looking into it.', at: '2026-09-28T17:05:00Z' },
    ],
  },
  {
    id: 't-2',
    category: 'help',
    title: 'GRIDLOCK crashes on the loading screen (PC)',
    author: 'turbo_tess',
    body: 'Game freezes at 92% loading on an RTX 3060. Drivers are up to date. Anyone else?',
    at: '2026-10-02T09:12:00Z',
    replies: [
      { id: 'r-3', author: 'kernelpanic', body: 'Disabling the overlay in your GPU app fixed it for me.', at: '2026-10-02T10:01:00Z' },
    ],
  },
  {
    id: 't-3',
    category: 'showcase',
    title: 'Paper Moons any% in 41:07 (new PB)',
    author: 'foldframe',
    body: 'Routed the cloud skip in world 3. Full VOD in the comments, feedback welcome.',
    at: '2026-10-01T21:30:00Z',
    replies: [],
  },
  {
    id: 't-4',
    category: 'feedback',
    title: 'Ironclad Tactics needs a replay system',
    author: 'mechmother',
    body: 'Would love to rewatch matches turn by turn. Who else wants this?',
    at: '2026-09-25T13:00:00Z',
    replies: [
      { id: 'r-4', author: 'pixelwitch', body: '+1, also for sharing funny moments.', at: '2026-09-25T15:20:00Z' },
      { id: 'r-5', author: 'turbo_tess', body: 'Yes please.', at: '2026-09-26T08:00:00Z' },
    ],
  },
  {
    id: 't-5',
    category: 'general',
    title: 'What Neoworks game got you into the studio?',
    author: 'kernelpanic',
    body: 'For me it was Ironclad Tactics. Curious where everyone started.',
    at: '2026-09-30T19:45:00Z',
    replies: [],
  },
]
