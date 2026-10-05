import type { CSSProperties } from 'react'
import type { Game } from '../data/fixtures'
import { daysUntil, fmtDate } from '../store'
import { Cover } from './Cover'

export function GameCard({ game, style }: { game: Game; style?: CSSProperties }) {
  const d = daysUntil(game.date)
  return (
    <article className="game-card reveal" style={style}>
      <Cover title={game.title} hue={game.hue} />
      <div className="game-card__body">
        <div className="game-card__meta">
          <span className={`pill pill--${game.status}`}>{game.status === 'upcoming' ? 'Upcoming' : 'Out now'}</span>
          <span className="mono">{game.genre}</span>
        </div>
        <h3>{game.title}</h3>
        <p>{game.tagline}</p>
        <div className="game-card__foot">
          <span className="mono">{game.platforms.join(' · ')}</span>
          <span className="mono game-card__date">
            {game.status === 'upcoming' && d > 0 ? `T-${d}d · ${fmtDate(game.date)}` : fmtDate(game.date)}
          </span>
        </div>
      </div>
    </article>
  )
}
