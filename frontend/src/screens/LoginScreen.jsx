import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function LoginScreen() {
  const { setScreen, setAuth } = useLewisStore()
  const [mode, setMode] = useState('register') // 'register' or 'login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
    const endpoint = mode === 'register' ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`
    const payload = mode === 'register' ? { email, password, name } : { email, password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed')
      }

      // Save user & token into Zustand store + localStorage
      setAuth(data.user, data.token)
      useLewisStore.setState({ authPendingDownload: true })
      
      // Return back to mirror screen to unlock full report & download PDF
      setScreen('mirror')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}
    >
      <div className="mirror-card" style={{ 
        maxWidth: '460px', 
        width: '100%', 
        padding: '36px 32px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: '28px',
        border: '1.5px solid rgba(0, 174, 157, 0.25)',
        boxShadow: '0 16px 48px rgba(0, 174, 157, 0.12)'
      }}>
        {/* Header Eyebrow */}
        <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '6px', color: 'var(--dawn)', fontWeight: 700 }}>
          SECURE ACCESS
        </p>

        <h1 className="headline" style={{ textAlign: 'center', marginBottom: '8px', fontSize: '26px', fontWeight: 800 }}>
          {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
        </h1>

        <p className="sub" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px', color: 'var(--text-mute)' }}>
          {mode === 'register' 
            ? 'Sign up to securely save and download your full 16-page LEWIS Insight Report.'
            : 'Sign in to access your saved reflections and full PDF report.'}
        </p>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          width: '100%',
          background: 'rgba(0, 174, 157, 0.08)',
          padding: '4px',
          borderRadius: '999px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '999px',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: mode === 'register' ? 700 : 500,
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? 'var(--dawn)' : 'var(--text-mute)',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '999px',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: mode === 'login' ? 700 : 500,
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? 'var(--dawn)' : 'var(--text-mute)',
              boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(230, 82, 80, 0.1)',
                border: '1px solid rgba(230, 82, 80, 0.3)',
                color: '#e65250',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-mute)', display: 'block', marginBottom: '6px', textAlign: 'left' }}>
                YOUR NAME
              </label>
              <input
                type="text"
                placeholder="First & last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#ffffff',
                  color: 'var(--text)',
                  fontSize: '14.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--dawn)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-mute)', display: 'block', marginBottom: '6px', textAlign: 'left' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#ffffff',
                color: 'var(--text)',
                fontSize: '14.5px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--dawn)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-mute)', display: 'block', marginBottom: '6px', textAlign: 'left' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{
                  width: '100%',
                  padding: '14px 44px 14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#ffffff',
                  color: 'var(--text)',
                  fontSize: '14.5px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--dawn)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-mute)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              marginTop: '12px', 
              padding: '16px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #00ae9d 0%, #10b981 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 8px 24px rgba(0, 174, 157, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <span>Connecting to engine...</span>
            ) : (
              <span>{mode === 'register' ? 'Create Account & Unlock' : 'Sign In & Unlock'}</span>
            )}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-mute)', textAlign: 'center', lineHeight: '1.5' }}>
          🔒 Your data is encrypted and private. LEWIS never sells or shares your reflections.
        </p>
      </div>
    </motion.section>
  )
}
