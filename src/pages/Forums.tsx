import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FORUM_CATEGORIES, type ForumCategoryId } from '../data/fixtures'
import { timeAgo, useStore } from '../store'

export function Forums() {
  const { threads, user, isCreator, addThread } = useStore()
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const active = params.get('c') as ForumCategoryId | null
  const [composing, setComposing] = useState(false)
  const [draft, setDraft] = useState({ title: '', body: '', category: (active && active !== 'announcements' ? active : 'general') as ForumCategoryId })
  const [error, setError] = useState('')

  const list = threads
    .filter((t) => !active || t.category === active)
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.localeCompare(a.at))

  const post = (e: FormEvent) => {
    e.preventDefault()
    if (draft.title.trim().length < 4) return setError('Give your thread a title (4+ characters).')
    if (!draft.body.trim()) return setError('Write something in the body.')
    const id = addThread({ ...draft, title: draft.title.trim(), body: draft.body.trim() })
    nav(`/forums/${id}`)
  }

  const categories = FORUM_CATEGORIES.filter((c) => c.id !== 'announcements' || isCreator)

  return (
    <div className="page">
      <header className="page-head page-head--row">
        <div>
          <p className="eyebrow">Community</p>
          <h1>Forums</h1>
          <p className="page-head__lede">Talk shop, report bugs, share clips, and hear from the team first.</p>
        </div>
        {user ? (
          <button className="btn" onClick={() => setComposing((c) => !c)}>{composing ? 'Cancel' : '+ New thread'}</button>
        ) : (
          <Link to="/login" className="btn">Sign in to post</Link>
        )}
      </header>

      {composing && (
        <form className="panel composer reveal" onSubmit={post}>
          <div className="row">
            <label>Title<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="What's on your mind?" /></label>
            <label>Board
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ForumCategoryId })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <label>Post<textarea rows={5} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Details, links, specs…" /></label>
          {error && <p className="error">{error}</p>}
          <button className="btn">Post thread</button>
        </form>
      )}

      <div className="forums">
        <aside className="boards">
          <button className={!active ? 'is-active' : ''} onClick={() => setParams({})}>
            <strong>All boards</strong><span className="mono">{threads.length}</span>
          </button>
          {FORUM_CATEGORIES.map((c) => (
            <button key={c.id} className={active === c.id ? 'is-active' : ''} onClick={() => setParams({ c: c.id })}>
              <strong>{c.name}</strong>
              <span className="mono">{threads.filter((t) => t.category === c.id).length}</span>
              <small>{c.blurb}</small>
            </button>
          ))}
        </aside>

        {list.length ? (
          <ul className="thread-list thread-list--full">
            {list.map((t, i) => (
              <li key={t.id} className="reveal" style={{ animationDelay: `${i * 40}ms` }}>
                <Link to={`/forums/${t.id}`} className="thread-row">
                  <span className="thread-row__title">
                    {t.pinned && <span className="pin">Pinned</span>}
                    {t.title}
                  </span>
                  <span className="thread-row__excerpt">{t.body}</span>
                  <span className="mono">
                    <b className={t.author === 'neoworks' ? 'staff' : ''}>@{t.author}</b> · {FORUM_CATEGORIES.find((c) => c.id === t.category)?.name} · {timeAgo(t.at)}
                  </span>
                  <span className="thread-row__count"><strong>{t.replies.length}</strong><small>replies</small></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <h3>This board is quiet</h3>
            <p>Be the first to start a thread here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
