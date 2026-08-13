import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lewis Application Render Error:', error, errorInfo)
  }

  handleReset = () => {
    try {
      localStorage.removeItem('lewis_auth_token')
      localStorage.removeItem('lewis_user')
      if (typeof window !== 'undefined') {
        window.location.hash = 'landing'
        window.history.replaceState({ screen: 'landing' }, '', '#landing')
      }
    } catch (e) {
      console.warn(e)
    }
    this.setState({ hasError: false, error: null })
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error ? (this.state.error.message || String(this.state.error)) : 'Unknown Error'
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: '24px',
          fontFamily: "'Nunito', sans-serif",
          textAlign: 'center',
          background: '#f4faf8',
          color: '#414242',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: '#ffffff',
            padding: '36px 32px',
            borderRadius: '24px',
            boxShadow: '0 16px 48px rgba(0, 174, 157, 0.12)',
            border: '1.5px solid rgba(0, 174, 157, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#e4f4ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <svg width="24" height="24" viewBox="0 0 82 82">
                <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="41" cy="41" r="11" fill="#00AE9D" />
              </svg>
            </div>
            
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '22px', fontWeight: 800, color: '#414242', margin: '0 0 10px 0' }}>
              Lewis Application Recovered
            </h2>
            
            <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 16px 0', lineHeight: '1.5' }}>
              An unexpected display issue occurred. You can return to the main home screen to safely continue your assessment reflection.
            </p>

            {errorMsg && (
              <div style={{
                background: '#fff5f5',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#991b1b',
                wordBreak: 'break-word',
                textAlign: 'left',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <strong>Error:</strong> {errorMsg}
              </div>
            )}

            <button
              onClick={this.handleReset}
              style={{
                background: '#00ae9d',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                fontFamily: "'Nunito', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 174, 157, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              Return to Home Screen
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
