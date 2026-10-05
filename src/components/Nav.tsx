import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export function Nav() {
  const { user, isCreator, signOut, dirty } = useStore()
  const nav = useNavigate()
  return (
    <header className="nav">
      <Link to="/" className="brand">
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
          <path d="M7 25V7l18 18V7" stroke="currentColor" strokeWidth="4" fill="none" strokeLinejoin="round" />
        </svg>
        NEOWORKS
      </Link>
      <nav className="nav__links">
        <NavLink to="/games" end>Games</NavLink>
        <NavLink to="/forums">Forums</NavLink>
        {isCreator && (
          <NavLink to="/studio" className="nav__studio">
            Studio{dirty && <i className="dot" title="Unsaved changes" />}
          </NavLink>
        )}
      </nav>
      <div className="nav__auth">
        {user ? (
          <>
            <span className="mono nav__user">@{user}</span>
            <button className="btn btn--ghost btn--sm" onClick={() => { signOut(); nav('/') }}>Sign out</button>
          </>
        ) : (
          <Link to="/login" className="btn btn--sm">Sign in</Link>
        )}
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="brand brand--sm">NEOWORKS</span>
      <span className="mono">Independent game studio · Est. 2021</span>
      <span className="mono">© {new Date().getFullYear()} Neoworks</span>
    </footer>
  )
}
