import { Link } from 'react-router-dom'
import { Cover } from '../components/Cover'
import { GameCard } from '../components/GameCard'
import { daysUntil, fmtDate, timeAgo, useStore } from '../store'

export function Home() {
  const { games, threads } = useStore()
  const upcoming = games.filter((g) => g.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))
  const released = games.filter((g) => g.status === 'released').sort((a, b) => b.date.localeCompare(a.date))
  const next = upcoming[0]
  const latest = [...threads].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4)

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow reveal">Independent game studio</p>
          <h1 className="hero__title reveal" style={{ animationDelay: '80ms' }}>
            We build<br />worlds that<br /><em>play back.</em>
          </h1>
          <p className="hero__lede reveal" style={{ animationDelay: '160ms' }}>
            Neoworks makes strange, loud, handcrafted games. Track every launch, see what you can play now, and hang out with the players who already found us.
          </p>
          <div className="hero__cta reveal" style={{ animationDelay: '240ms' }}>
            <Link to="/games" className="btn btn--lg">Browse games</Link>
            <Link to="/forums" className="btn btn--ghost btn--lg">Join the forums</Link>
          </div>
          <dl className="stats reveal" style={{ animationDelay: '320ms' }}>
            <div><dt>Released</dt><dd>{released.length}</dd></div>
            <div><dt>In development</dt><dd>{upcoming.length}</dd></div>
            <div><dt>Forum threads</dt><dd>{threads.length}</dd></div>
          </dl>
        </div>

        {next && (
          <Link to="/games?tab=upcoming" className="hero__next reveal" style={{ animationDelay: '200ms' }}>
            <Cover title={next.title} hue={next.hue} big />
            <div className="hero__next-info">
              <span className="eyebrow">Next launch</span>
              <h2>{next.title}</h2>
              <p>{next.tagline}</p>
              <div className="countdown">
                <strong>{Math.max(daysUntil(next.date), 0)}</strong>
                <span className="mono">days<br />to {fmtDate(next.date)}</span>
              </div>
            </div>
          </Link>
        )}
      </section>

      <div className="ticker" aria-hidden>
        <div className="ticker__track">
          {[...games, ...games].map((g, i) => (
            <span key={i}>{g.title} <b>{g.status === 'upcoming' ? `◷ ${fmtDate(g.date)}` : '● OUT NOW'}</b></span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="section__head">
          <h2>Out now</h2>
          <Link to="/games?tab=released" className="link">All released →</Link>
        </div>
        <div className="grid">
          {released.slice(0, 3).map((g, i) => <GameCard key={g.id} game={g} style={{ animationDelay: `${i * 70}ms` }} />)}
        </div>
      </section>

      <section className="section split">
        <div>
          <div className="section__head">
            <h2>From the forums</h2>
            <Link to="/forums" className="link">All threads →</Link>
          </div>
          <ul className="thread-list">
            {latest.map((t) => (
              <li key={t.id}>
                <Link to={`/forums/${t.id}`} className="thread-row">
                  <span className="thread-row__title">{t.pinned && <span className="pin">Pinned</span>}{t.title}</span>
                  <span className="mono">@{t.author} · {timeAgo(t.at)} · {t.replies.length} replies</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <aside className="neo-card">
          <div className="assist__avatar assist__avatar--lg">N</div>
          <h3>Meet Neo</h3>
          <p>Our assistant knows the whole release calendar. Ask what's out, what's coming, or where to post a bug report. Look for <b>Ask Neo</b> in the corner of any page.</p>
        </aside>
      </section>
    </div>
  )
}
