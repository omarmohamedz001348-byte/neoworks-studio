import { Link, useSearchParams } from 'react-router-dom'
import { GameCard } from '../components/GameCard'
import { useStore } from '../store'

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'released', label: 'Released' },
] as const

export function Games() {
  const { games, isCreator } = useStore()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'released' ? 'released' : 'upcoming'
  const list = games
    .filter((g) => g.status === tab)
    .sort((a, b) => (tab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)))

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">The catalog</p>
        <h1>Games</h1>
        <p className="page-head__lede">Everything Neoworks has shipped, and everything we're still building.</p>
        {isCreator && <Link to="/studio" className="btn btn--ghost btn--sm">Edit games in Studio →</Link>}
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'is-active' : ''}
            onClick={() => setParams({ tab: t.id })}
          >
            {t.label}
            <span className="tabs__count">{games.filter((g) => g.status === t.id).length}</span>
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="grid" key={tab}>
          {list.map((g, i) => <GameCard key={g.id} game={g} style={{ animationDelay: `${i * 60}ms` }} />)}
        </div>
      ) : (
        <div className="empty">
          <h3>No {tab} games yet</h3>
          <p>{tab === 'upcoming' ? 'New announcements land here first.' : 'Our first launch is on the way.'}</p>
        </div>
      )}
    </div>
  )
}
