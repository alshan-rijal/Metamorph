import { useEffect, useState } from 'react'
import { CircleHelp, History, KeyRound, LogOut, Mail, Pencil, Save, Settings, UserRound, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

function initials(name = 'Member') { return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() }
function isGoogle(user) { return user?.app_metadata?.provider === 'google' || user?.user_metadata?.provider === 'google' }
function hasPassword(user) { return user?.app_metadata?.providers?.includes('email') || !isGoogle(user) }
function localHistory(userId) { try { const value = JSON.parse(localStorage.getItem(`conversion_history_${userId}`) || '[]'); return Array.isArray(value) ? value : [] } catch { return [] } }

export default function ProfilePage({ user }) {
  const { signOut, updateProfile, updatePassword, resetPassword } = useAuth()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Metamorph member'
  const avatar = user?.user_metadata?.avatar_url
  const [items, setItems] = useState(() => localHistory(user.id))
  const [editing, setEditing] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [newName, setNewName] = useState(name)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  useEffect(() => { if (!supabase) return; supabase.from('conversion_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => { if (data) setItems(data) }) }, [user.id])
  const imageCount = items.filter((item) => item.conversion_type?.includes('image')).length
  const pdfCount = items.filter((item) => item.conversion_type?.includes('pdf')).length
  const saveName = async () => { setSaving(true); await updateProfile(newName); setSaving(false); setEditing(false) }
  const savePassword = async (event) => { event.preventDefault(); setPasswordError(''); setPasswordMessage(''); if (newPassword.length < 6) { setPasswordError('Use at least 6 characters.'); return } if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return } setSaving(true); const result = await updatePassword(newPassword); setSaving(false); if (result?.error) setPasswordError(result.error.message); else { setPasswordMessage('Password saved. You can now log in with email and password.'); setNewPassword(''); setConfirmPassword('') } }
  const sendReset = async () => { setPasswordError(''); setPasswordMessage(''); setSaving(true); const result = await resetPassword(user.email); setSaving(false); if (result?.error) setPasswordError(result.error.message); else setPasswordMessage('Password reset email sent. Check your inbox.') }
  const rows = [{ label: 'Edit Profile', icon: Pencil, action: () => setEditing(true) }, { label: 'Conversion History', icon: History, to: '/history' }, { label: 'Account Settings', icon: Settings, action: () => setSettingsOpen((current) => !current) }, { label: 'Help & Support', icon: CircleHelp, to: '/about' }]
  return <main><section className="profile-page"><div className="profile-card profile-summary"><div className="profile-avatar">{avatar ? <img src={avatar} alt="" /> : initials(name)}</div><h1>{name}</h1><span className="account-badge">{isGoogle(user) ? <UserRound size={13} /> : <Mail size={13} />}{isGoogle(user) ? 'Google Account' : 'Email Account'}</span>{editing && <div className="profile-edit"><label>Display name<input value={newName} onChange={(event) => setNewName(event.target.value)} aria-label="Display name" /></label><button className="primary-btn" onClick={saveName} disabled={saving}><Save size={14} />{saving ? 'Saving...' : 'Save name'}</button></div>}<div className="profile-stats"><div><strong>{imageCount}</strong><span>Images converted</span></div><div><strong>{pdfCount}</strong><span>PDFs converted</span></div></div></div><div className="profile-card profile-settings">{rows.map(({ label, icon: Icon, action, to }) => to ? <Link className="settings-row" to={to} key={label}><span className="settings-icon"><Icon size={17} /></span><strong>{label}</strong><ChevronRight size={17} /></Link> : <button className="settings-row" onClick={action} key={label}><span className="settings-icon"><Icon size={17} /></span><strong>{label}</strong><ChevronRight size={17} /></button>)}{(settingsOpen || isGoogle(user)) && <div className="password-section"><button className="password-heading" onClick={() => setPasswordOpen((current) => !current)}><KeyRound size={16} /><strong>{hasPassword(user) ? 'Change Password' : 'Add a password'}</strong></button>{passwordOpen && <form onSubmit={savePassword}><label>New Password<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={6} required /></label><label>Confirm Password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required /></label>{passwordError && <p className="password-error" role="alert">{passwordError}</p>}{passwordMessage && <p className="password-message" role="status">{passwordMessage}</p>}<button className="primary-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Password'}</button>{hasPassword(user) && <button type="button" className="reset-password-btn" onClick={sendReset} disabled={saving}>Send password reset email</button>}</form>}</div>}</div><button className="logout-btn" onClick={signOut}><LogOut size={16} /> Log out</button></section></main>
}
