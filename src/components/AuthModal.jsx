import { useEffect, useState } from 'react'
import { ArrowRight, Check, LockKeyhole, Mail, UserRound, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'

function GoogleLogo() {
  return <svg className="google-logo-svg" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.715v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.613Z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.182l-2.908-2.258c-.806.54-1.834.86-3.048.86-2.344 0-4.33-1.584-5.04-3.715H.954v2.332A9 9 0 0 0 9 18Z" /><path fill="#FBBC05" d="M3.96 10.705A5.41 5.41 0 0 1 3.678 9c0-.592.102-1.167.282-1.705V4.963H.954A9 9 0 0 0 0 9c0 1.453.348 2.827.954 4.037l3.006-2.332Z" /><path fill="#EA4335" d="M9 3.58c1.322 0 2.508.454 3.442 1.345l2.582-2.582C13.463.892 11.426 0 9 0A9 9 0 0 0 .954 4.963L3.96 7.295C4.67 5.164 6.656 3.58 9 3.58Z" /></svg>
}

function AccentPanel({ isSignUp, onToggle }) {
  return <aside className="auth-accent-panel">
    <div className="auth-accent-content">
      <h3>{isSignUp ? 'Create account.' : 'Welcome back.'}</h3>
      <p>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</p>
      <button className="accent-outline-btn" type="button" onClick={onToggle}>{isSignUp ? 'Login' : 'Sign up'} <ArrowRight size={15} /></button>
    </div>
  </aside>
}

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const toggle = () => { setIsSignUp((current) => !current); setError(''); setMessage(''); setSuccess(false) }
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const result = isSignUp ? await signUp(email, password, name) : await signIn(email, password)
    setLoading(false)
    if (result?.error) { setError(result.error.message.includes('confirmed') ? 'Please confirm your email address before logging in.' : result.error.message); return }
    if (isSignUp) { setSuccess(true); setMessage(result.data?.session ? 'Your account is ready.' : 'Check your email to confirm your address before logging in.') } else onClose()
  }

  return <div className="modal-backdrop" onClick={onClose} role="presentation">
    <div className={`auth-modal ${isSignUp ? 'signup' : 'login'}`} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <section className="auth-form-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close login"><X size={18} /></button>
        <Logo className="auth-logo" alt="Metamorph" />
        <span className="auth-kicker">{isSignUp ? 'Create your workspace' : 'Welcome to Metamorph'}</span>
        <h2 id="auth-title">{isSignUp ? 'Create account' : 'Login'}</h2>
        <p>{isSignUp ? 'Save your conversion history and pick up where you left off.' : 'Log in to save your conversion history.'}</p>
        {success ? <div className="auth-success" role="status"><Check size={18} /><div><strong>Account created</strong><span>{message}</span></div></div> : <>
          <div className="or"><span />or continue with<span /></div>
          <button type="button" className="google-btn" onClick={signInWithGoogle}><GoogleLogo /> <span>Continue with Google</span></button>
          <form onSubmit={submit}>
            {isSignUp && <label><span>Full name</span><div className="auth-input"><input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Alex Rivera" /><UserRound size={17} /></div></label>}
            <label><span>Email</span><div className="auth-input"><input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="you@example.com" /><Mail size={17} /></div></label>
            <label><span>Password</span><div className="auth-input"><input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} type="password" placeholder="At least 6 characters" /><LockKeyhole size={17} /></div></label>
            {!isSignUp && <button type="button" className="forgot-link">Forgot password?</button>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            {message && <p className="auth-message" role="status">{message}</p>}
            <button className="primary-btn full" disabled={loading}>{loading ? 'Working...' : isSignUp ? 'Create account' : 'Login'} <ArrowRight size={15} /></button>
          </form>
          <small>By continuing, you agree to our terms and privacy policy.</small>
          <div className="auth-switch">{isSignUp ? 'Already have an account?' : "Don't have an account?"}<button type="button" onClick={toggle}>{isSignUp ? 'Log in' : 'Sign up'} <ArrowRight size={14} /></button></div>
        </>}
      </section>
      <AccentPanel isSignUp={isSignUp} onToggle={toggle} />
    </div>
  </div>
}
