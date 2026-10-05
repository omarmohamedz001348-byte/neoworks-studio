import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Cover, COVER_COUNT } from '../components/Cover'
import type { GameStatus } from '../data/fixtures'
import { fmtDate, timeAgo, useStore } from '../store'

const PLATFORMS = ['PC', 'PS5', 'Xbox', 'Switch', 'Mobile']

const blank = { title: '', tagline: '', genre: '', status: 'upcoming' as GameStatus, date: '', platforms: ['PC'], hue: 0 }

export function Studio() {
  const { isCreator, draft, games, dirty, addToDraft, removeFromDraft, toggleDraftStatus, saveChanges, discardChanges, lastSaved } = useStore()
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState(false)

  if (!isCreator) return <Navigate to="/login" replace />

  const published = new Set(games.map((g) => g.id))
  const added = draft.filter((g) => !published.has(g.id)).length
  const removed = games.filter((g) => !draft.some((d) => d.id === g.id)).length
  const edited = draft.filter((d) => {
    const g = games.find((x) => x.id === d.id)
    return g && g.status !== d.status
  }).length

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date || !form.genre.trim()) return setError('Title, genre and date are required.')
    if (!form.platforms.length) return setError('Pick at least one platform.')
    addToDraft({ ...form, title: form.title.trim(), genre: form.genre.trim(), tagline: form.tagline.trim() })
    setForm({ ...blank, hue: (form.hue + 1) % COVER_COUNT })
    setError('')
  }

  const save = () => {
    saveChanges()
    setFlash(true)
    setTimeout(() => setFlash(false), 2200)
  }

  return (
    <div className="page studio">
      <header className="page-head">
        <p className="eyebrow">@neoworks · Creator studio</p>
        <h1>Studio</h1>
        <p className="page-head__lede">Add or remove games, flip a game from upcoming to released, then save to publish your changes to the site.</p>
      </header>

      <div className="studio__grid">
        <form className="panel" onSubmit={submit}>
          <h2>Add a game</h2>
          <div className="studio__preview">
            <Cover title={form.title || 'New Game'} hue={form.hue} />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setForm({ ...form, hue: (form.hue + 1) % COVER_COUNT })}>
              Shuffle cover
            </button>
          </div>
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Starfall Protocol" /></label>
          <label>Tagline<input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="One line that sells it" /></label>
          <div className="row">
            <label>Genre<input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Action RPG" /></label>
            <label>{form.status === 'upcoming' ? 'Release date' : 'Released on'}<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          </div>
          <fieldset>
            <legend>Status</legend>
            <div className="seg">
              {(['upcoming', 'released'] as const).map((s) => (
                <button type="button" key={s} className={form.status === s ? 'is-active' : ''} onClick={() => setForm({ ...form, status: s })}>
                  {s === 'upcoming' ? 'Upcoming' : 'Released'}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Platforms</legend>
            <div className="chips">
              {PLATFORMS.map((p) => {
                const on = form.platforms.includes(p)
                return (
                  <button type="button" key={p} className={on ? 'is-active' : ''}
                    onClick={() => setForm({ ...form, platforms: on ? form.platforms.filter((x) => x !== p) : [...form.platforms, p] })}>
                    {p}
                  </button>
                )
              })}
            </div>
          </fieldset>
          {error && <p className="error">{error}</p>}
          <button className="btn">+ Add to draft</button>
        </form>

        <section className="panel">
          <div className="section__head">
            <h2>All games <span className="muted">({draft.length})</span></h2>
          </div>
          {draft.length ? (
            <ul className="manage">
              {draft.map((g) => {
                const isNew = !published.has(g.id)
                return (
                  <li key={g.id} className={isNew ? 'is-new' : ''}>
                    <Cover title={g.title} hue={g.hue} />
                    <div className="manage__info">
                      <strong>{g.title} {isNew && <span className="pill pill--new">New</span>}</strong>
                      <span className="mono">{g.genre} · {fmtDate(g.date)}</span>
                    </div>
                    <button className={`pill pill--${g.status} pill--btn`} onClick={() => toggleDraftStatus(g.id)} title="Toggle status">
                      {g.status === 'upcoming' ? 'Upcoming' : 'Released'} ⇄
                    </button>
                    <button className="icon-btn" onClick={() => removeFromDraft(g.id)} aria-label={`Remove ${g.title}`}>Remove</button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="empty"><h3>No games</h3><p>Add your first game with the form.</p></div>
          )}
        </section>
      </div>

      <div className={`savebar ${dirty ? 'is-dirty' : ''} ${flash ? 'is-flash' : ''}`}>
        <div>
          {dirty ? (
            <>
              <strong>Unsaved changes</strong>
              <span className="mono">
                {[added && `${added} added`, removed && `${removed} removed`, edited && `${edited} status changed`].filter(Boolean).join(' · ')}
              </span>
            </>
          ) : flash ? (
            <strong>✓ Changes saved and live on the site</strong>
          ) : (
            <span className="mono">All changes saved{lastSaved ? ` · ${timeAgo(lastSaved)}` : ''}</span>
          )}
        </div>
        <div className="savebar__actions">
          <button className="btn btn--ghost btn--sm" disabled={!dirty} onClick={discardChanges}>Discard</button>
          <button className="btn btn--sm" disabled={!dirty} onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  )
}
