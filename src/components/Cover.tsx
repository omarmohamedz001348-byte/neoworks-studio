import type { CSSProperties } from 'react'

const PALETTES = [
  ['#c8ff2e', '#1b3a00', '#0b0c10'],
  ['#ff3d7f', '#2a0418', '#0b0c10'],
  ['#ffb02e', '#3a2200', '#0b0c10'],
  ['#7a5cff', '#160b3a', '#0b0c10'],
  ['#2ee6ff', '#00303a', '#0b0c10'],
  ['#ff6a2e', '#3a1000', '#0b0c10'],
]

export const COVER_COUNT = PALETTES.length

/** Generative CSS cover art so every game gets a distinct, on-brand poster. */
export function Cover({ title, hue, big = false }: { title: string; hue: number; big?: boolean }) {
  const [a, b, c] = PALETTES[hue % PALETTES.length]
  const initials = title.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('')
  return (
    <div
      className={`cover ${big ? 'cover--big' : ''}`}
      style={{ '--a': a, '--b': b, '--c': c } as CSSProperties}
      aria-hidden
    >
      <div className="cover__grid" />
      <div className="cover__sun" />
      <span className="cover__mark">{initials.toUpperCase()}</span>
    </div>
  )
}
