import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CREATOR_USERNAME, INITIAL_GAMES, INITIAL_THREADS, type Game, type Thread } from './data/fixtures'

// Prototype persistence: browser storage stands in for Netlify Database until milestone 2.
const GAMES_KEY = 'neoworks:games'
const THREADS_KEY = 'neoworks:threads'
const SESSION_KEY = 'neoworks:session'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

interface Store {
  /** Published games visible to every visitor. */
  games: Game[]
  /** Creator's working copy in the Studio. */
  draft: Game[]
  dirty: boolean
  addToDraft: (game: Omit<Game, 'id'>) => void
  removeFromDraft: (id: string) => void
  toggleDraftStatus: (id: string) => void
  saveChanges: () => void
  discardChanges: () => void
  lastSaved: string | null

  user: string | null
  signIn: (username: string, password: string) => boolean
  signOut: () => void
  isCreator: boolean

  threads: Thread[]
  addThread: (t: Pick<Thread, 'category' | 'title' | 'body'>) => string
  addReply: (threadId: string, body: string) => void
  removeThread: (id: string) => void
}

const Ctx = createContext<Store | null>(null)

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`

export function StoreProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>(() => load(GAMES_KEY, INITIAL_GAMES))
  const [draft, setDraft] = useState<Game[]>(games)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [user, setUser] = useState<string | null>(() => load<string | null>(SESSION_KEY, null))
  const [threads, setThreads] = useState<Thread[]>(() => load(THREADS_KEY, INITIAL_THREADS))

  useEffect(() => localStorage.setItem(THREADS_KEY, JSON.stringify(threads)), [threads])

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(games), [draft, games])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const saveChanges = useCallback(() => {
    setGames(draft)
    localStorage.setItem(GAMES_KEY, JSON.stringify(draft))
    setLastSaved(new Date().toISOString())
  }, [draft])

  // Placeholder sign-in: milestone 3 swaps this for Netlify Identity.
  const signIn = useCallback((username: string, password: string) => {
    const name = username.trim().toLowerCase()
    if (!name || !password) return false
    setUser(name)
    localStorage.setItem(SESSION_KEY, JSON.stringify(name))
    return true
  }, [])

  const value: Store = {
    games,
    draft,
    dirty,
    addToDraft: (g) => setDraft((d) => [{ ...g, id: uid('g') }, ...d]),
    removeFromDraft: (id) => setDraft((d) => d.filter((g) => g.id !== id)),
    toggleDraftStatus: (id) =>
      setDraft((d) => d.map((g) => (g.id === id ? { ...g, status: g.status === 'upcoming' ? 'released' : 'upcoming' } : g))),
    saveChanges,
    discardChanges: () => setDraft(games),
    lastSaved,
    user,
    signIn,
    signOut: () => {
      setUser(null)
      localStorage.removeItem(SESSION_KEY)
    },
    isCreator: user === CREATOR_USERNAME,
    threads,
    addThread: (t) => {
      const id = uid('t')
      setThreads((ts) => [{ ...t, id, author: user ?? 'guest', at: new Date().toISOString(), replies: [] }, ...ts])
      return id
    },
    addReply: (threadId, body) =>
      setThreads((ts) =>
        ts.map((t) =>
          t.id === threadId
            ? { ...t, replies: [...t.replies, { id: uid('r'), author: user ?? 'guest', body, at: new Date().toISOString() }] }
            : t,
        ),
      ),
    removeThread: (id) => setThreads((ts) => ts.filter((t) => t.id !== id)),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)

export const timeAgo = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
