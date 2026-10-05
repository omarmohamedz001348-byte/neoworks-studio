import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FORUM_CATEGORIES, type Game, type Thread } from '../data/fixtures'
import { daysUntil, fmtDate, useStore } from '../store'

interface Msg {
  from: 'bot' | 'me'
  text: string
  links?: { to: string; label: string }[]
}

const SUGGESTIONS = ['What games are out now?', "What's coming next?", 'When does Voidrunner release?', 'Where do I report a bug?']

/**
 * Neo, the site assistant. Answers come from local rules over live site data for now;
 * a later milestone routes questions to a model through Netlify AI Gateway.
 */
function answer(q: string, games: Game[], threads: Thread[]): Msg {
  const s = q.toLowerCase()
  const upcoming = games.filter((g) => g.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))
  const released = games.filter((g) => g.status === 'released').sort((a, b) => b.date.localeCompare(a.date))

  const match = games.find((g) => s.includes(g.title.toLowerCase()) || s.includes(g.title.toLowerCase().split(' ')[0]))
  if (match) {
    const d = daysUntil(match.date)
    const text =
      match.status === 'released'
        ? `${match.title} is out now. It released ${fmtDate(match.date)} on ${match.platforms.join(', ')}. ${match.tagline}`
        : `${match.title} isn't out yet. It's set for ${fmtDate(match.date)}${d > 0 ? ` (${d} days away)` : ''} on ${match.platforms.join(', ')}.`
    return { from: 'bot', text, links: [{ to: '/games', label: 'See all games' }] }
  }

  if (/(out now|released|available|can i play|play now)/.test(s))
    return {
      from: 'bot',
      text: released.length
        ? `Out now: ${released.map((g) => `${g.title} (${fmtDate(g.date)})`).join(', ')}.`
        : 'Nothing has been released yet. Stay tuned!',
      links: [{ to: '/games?tab=released', label: 'Released games' }],
    }

  if (/(upcoming|coming|next|soon|not released|unreleased|release date|when)/.test(s))
    return {
      from: 'bot',
      text: upcoming.length
        ? `Coming up: ${upcoming.map((g) => `${g.title} on ${fmtDate(g.date)}`).join(', ')}. The next launch is ${upcoming[0].title}.`
        : 'No upcoming games are announced right now.',
      links: [{ to: '/games?tab=upcoming', label: 'Upcoming games' }],
    }

  if (/(bug|crash|help|support|broken|error|fix)/.test(s))
    return {
      from: 'bot',
      text: 'Sorry about that! Post in Help & Support with your platform, hardware and what happened just before the problem. Someone from the community or the team usually answers quickly.',
      links: [{ to: '/forums?c=help', label: 'Open Help & Support' }],
    }

  if (/(forum|post|thread|topic|discuss|community|talk)/.test(s)) {
    const hot = [...threads].sort((a, b) => b.replies.length - a.replies.length)[0]
    return {
      from: 'bot',
      text: `The forums have ${FORUM_CATEGORIES.length} boards: ${FORUM_CATEGORIES.map((c) => c.name).join(', ')}. Hit "New thread" to start a topic.${hot ? ` The busiest thread right now is "${hot.title}".` : ''}`,
      links: [{ to: '/forums', label: 'Go to forums' }, ...(hot ? [{ to: `/forums/${hot.id}`, label: 'Busiest thread' }] : [])],
    }
  }

  if (/^(hi|hello|hey|yo)\b/.test(s))
    return { from: 'bot', text: "Hey! I'm Neo. Ask me what's released, what's coming, or how to use the forums." }

  return {
    from: 'bot',
    text: "I can help with release dates, what's out now, and finding your way around the forums. Try one of the suggestions below.",
  }
}

export function Assistant() {
  const { games, threads } = useStore()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: "I'm Neo, the Neoworks assistant. Ask me about upcoming and released games, or get help with the forums." },
  ])
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, typing])

  const send = (text: string) => {
    if (!text.trim() || typing) return
    setMsgs((m) => [...m, { from: 'me', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMsgs((m) => [...m, answer(text, games, threads)])
      setTyping(false)
    }, 550)
  }

  return (
    <>
      <button className={`assist-fab ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Open Neo assistant">
        {open ? '×' : <><span className="assist-fab__pulse" />Ask Neo</>}
      </button>
      {open && (
        <section className="assist" aria-label="Neo assistant">
          <header className="assist__head">
            <div className="assist__avatar">N</div>
            <div>
              <strong>Neo</strong>
              <span className="mono">Games & forums assistant</span>
            </div>
          </header>
          <div className="assist__log">
            {msgs.map((m, i) => (
              <div key={i} className={`bubble bubble--${m.from}`}>
                {m.text}
                {m.links && (
                  <div className="bubble__links">
                    {m.links.map((l) => (
                      <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label} →</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="bubble bubble--bot bubble--typing"><i /><i /><i /></div>}
            <div ref={end} />
          </div>
          <div className="assist__chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}>{s}</button>
            ))}
          </div>
          <form className="assist__form" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a game or the forums…" />
            <button className="btn btn--sm" disabled={!input.trim()}>Send</button>
          </form>
        </section>
      )}
    </>
  )
}
