import { useEffect, useRef, useState } from 'react'
import { ChevronDown, History, Home, LogOut, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
const logoAsset = '/images/branding/app-logo.png'

function initials(name = 'Guest') { return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() }

export default function Header({ onAuth, dark, setDark, user }) {
  const [menu, setMenu] = useState(false)
  const [tools, setTools] = useState(false)
  const location = useLocation()
  const { signOut } = useAuth()
  const dropdownRef = useRef(null)
  const closeTimer = useRef(null)
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'
  const avatar = user?.user_metadata?.avatar_url
  const openTools = () => { window.clearTimeout(closeTimer.current); setTools(true) }
  const scheduleClose = () => { window.clearTimeout(closeTimer.current); closeTimer.current = window.setTimeout(() => setTools(false), 180) }
  useEffect(() => { const onPointerDown = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setTools(false) }; const onKeyDown = (event) => { if (event.key === 'Escape') { setTools(false); setMenu(false) } }; document.addEventListener('pointerdown', onPointerDown); document.addEventListener('keydown', onKeyDown); return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); window.clearTimeout(closeTimer.current) } }, [])
  return <header className="topbar"><Link className="brand" to="/"><img className="brand-logo" src={logoAsset} alt="Metamorph" /> Metamorph</Link><nav><Link className={location.pathname === '/' ? 'active-nav' : ''} to="/"><Home size={14} /> Home</Link><div className="nav-dropdown" ref={dropdownRef} onMouseEnter={openTools} onMouseLeave={scheduleClose} onPointerEnter={openTools} onPointerLeave={scheduleClose}><button aria-expanded={tools} className={location.pathname === '/convert' ? 'active-nav' : ''} onClick={() => { window.clearTimeout(closeTimer.current); setTools((current) => !current) }}>Convert <ChevronDown size={13} /></button>{tools && <div className="nav-menu" onMouseEnter={openTools} onMouseLeave={scheduleClose} onPointerEnter={openTools} onPointerLeave={scheduleClose}><Link to="/convert" onClick={() => setTools(false)}>Image tools</Link><Link to="/convert?tool=pdf" onClick={() => setTools(false)}>PDF tools</Link></div>}</div><Link className={location.pathname === '/about' ? 'active-nav' : ''} to="/about">About</Link><Link className={location.pathname === '/history' ? 'active-nav' : ''} to="/history"><History size={14} /> History</Link></nav><div className="top-actions"><button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>{user ? <><button className="avatar" onClick={() => setMenu((current) => !current)}>{avatar ? <img src={avatar} alt="" /> : initials(name)}</button>{menu && <div className="profile-menu"><strong>{name}</strong><span>{user.email}</span><hr /><Link to="/profile" onClick={() => setMenu(false)}>Profile</Link><Link to="/history" onClick={() => setMenu(false)}>History</Link><hr /><button onClick={() => { setMenu(false); signOut() }}><LogOut size={14} /> Log out</button></div>}</> : <button className="ghost-btn" onClick={onAuth}>Log in</button>}</div></header>
}
