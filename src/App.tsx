import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Assistant } from './components/Assistant'
import { Footer, Nav } from './components/Nav'
import { Forums } from './pages/Forums'
import { Games } from './pages/Games'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Studio } from './pages/Studio'
import { ThreadPage } from './pages/Thread'

export function App() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (
    <div className="shell">
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forums/:id" element={<ThreadPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="*" element={<div className="page empty"><h1>404</h1><p>This level doesn't exist.</p></div>} />
        </Routes>
      </main>
      <Footer />
      <Assistant />
    </div>
  )
}
