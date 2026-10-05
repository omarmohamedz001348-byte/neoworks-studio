import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FORUM_CATEGORIES } from '../data/fixtures'
import { timeAgo, useStore } from '../store'

export function ThreadPage() {
  const { id } = useParams()
  const { threads, user, isCreator, addReply, removeThread } = useStore()
  const nav = useNavigate()
  const [reply, setReply] = useState('')
  const thread = threads.find((t) => t.id === id)

  if (!thread)
    return (
      <div className="page empty">
        <h1>Thread not found</h1>
        <p>It may have been removed.</p>
        <Link to="/forums" className="btn">Back to forums</Link>
      </div>
    )

  const cat = FORUM_CATEGORIES.find((c) => c.id === thread.category)

  return (
    <div className="page thread">
      <Link to={`/forums?c=${thread.category}`} className="link">← {cat?.name}</Link>
      <article className="post post--op reveal">
        <h1>{thread.pinned && <span className="pin">Pinned</span>}{thread.title}</h1>
        <div className="post__meta mono">
          <b className={thread.author === 'neoworks' ? 'staff' : ''}>@{thread.author}</b>
          {thread.author === 'neoworks' && <span className="pill pill--staff">Creator</span>}
          · {timeAgo(thread.at)}
        </div>
        <p>{thread.body}</p>
        {isCreator && (
          <button className="icon-btn" onClick={() => { removeThread(thread.id); nav('/forums') }}>Delete thread</button>
        )}
      </article>

      <h2 className="thread__count">{thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}</h2>
      <ol className="replies">
        {thread.replies.map((r, i) => (
          <li key={r.id} className="post reveal" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="post__meta mono">
              <b className={r.author === 'neoworks' ? 'staff' : ''}>@{r.author}</b>
              {r.author === 'neoworks' && <span className="pill pill--staff">Creator</span>}
              · {timeAgo(r.at)}
            </div>
            <p>{r.body}</p>
          </li>
        ))}
      </ol>

      {user ? (
        <form className="panel composer" onSubmit={(e) => { e.preventDefault(); if (reply.trim()) { addReply(thread.id, reply.trim()); setReply('') } }}>
          <label>Reply as @{user}<textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Add to the conversation…" /></label>
          <button className="btn" disabled={!reply.trim()}>Post reply</button>
        </form>
      ) : (
        <div className="panel"><Link to="/login" className="btn">Sign in to reply</Link></div>
      )}
    </div>
  )
}
