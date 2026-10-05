import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CREATOR_USERNAME } from '../data/fixtures'
import { useStore } from '../store'

export function Login() {
  const { signIn, user } = useStore()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to={user === CREATOR_USERNAME ? '/studio' : '/forums'} replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!signIn(username, password)) return setError('Enter a username and password.')
    nav(username.trim().toLowerCase() === CREATOR_USERNAME ? '/studio' : '/forums')
  }

  return (
    <div className="page auth">
      <form className="auth__card" onSubmit={submit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="muted">Players sign in to post on the forums. The <b>neoworks</b> creator account opens the Studio.</p>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="neoworks" autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn--lg">Sign in</button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => { signIn(CREATOR_USERNAME, 'preview'); nav('/studio') }}
        >
          Enter as @neoworks (preview)
        </button>
      </form>
    </div>
  )
}
