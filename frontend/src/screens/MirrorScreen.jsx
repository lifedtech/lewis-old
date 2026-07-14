import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'
import { buildFullAssessmentPayload } from '../lib/payload.js'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import ReactMarkdown from 'react-markdown'

export default function MirrorScreen() {
  const setScreen = useLewisStore((s) => s.setScreen)

  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const [missing, setMissing] = useState(null)

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const { payload, missing } = buildFullAssessmentPayload(useLewisStore.getState())
        if (missing.length > 0) {
          setMissing(missing)
          setLoading(false)
          return
        }

        const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        const response = await fetch(`${API_BASE}/assessment/full`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) throw new Error('Failed to fetch analysis')

        const data = await response.json()
        setAnalysis(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('Could not generate your narrative. Please ensure the backend is running.')
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [])

  if (loading) {
    return (
      <motion.section className="screen active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p className="q-text" style={{ textAlign: 'center' }}>LEWIS is synthesizing your results...</p>
      </motion.section>
    )
  }

  if (missing) {
    return (
      <motion.section className="screen active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <p className="eyebrow" style={{ textAlign: 'center' }}>Almost there</p>
        <h1 className="headline" style={{ textAlign: 'center' }}>A few check-ins still need answers.</h1>
        <p className="sub" style={{ textAlign: 'center', maxWidth: '480px', marginBottom: '24px' }}>
          LEWIS only reflects what you actually shared — unanswered questions are
          never guessed or filled in for you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '360px' }}>
          {missing.map((m) => (
            <button key={m.screen} className="btn-primary" style={{ width: '100%' }} onClick={() => setScreen(m.screen)}>
              Finish: {m.label}
            </button>
          ))}
        </div>
      </motion.section>
    )
  }

  if (error) {
    return (
      <motion.section className="screen active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <p className="q-text" style={{ textAlign: 'center', color: 'var(--dawn)' }}>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()} style={{marginTop: '24px'}}>Try Again</button>
      </motion.section>
    )
  }

  const dims = analysis?.dimensions
  let chartData = []
  let sortedData = []
  
  if (dims) {
    const dimKeys = [
      { key: 'emotional', label: 'Wellbeing' },
      { key: 'calm', label: 'Calm' },
      { key: 'relationships', label: 'Connection' },
      { key: 'accomplishment', label: 'Agency' },
      { key: 'meaning', label: 'Meaning' },
      { key: 'financial', label: 'Financial Peace' },
      { key: 'growth', label: 'Growth' },
      { key: 'environment', label: 'Nature' },
      { key: 'physical', label: 'Physical' },
      { key: 'energy', label: 'Energy' }
    ]
    
    dimKeys.forEach(({ key, label }) => {
      if (dims[key] && dims[key].score !== null) {
        chartData.push({ subject: label, A: dims[key].score, fullMark: 100 })
      }
    })

    sortedData = [...chartData].sort((a, b) => b.A - a.A)
  }

  const getBarColor = (score) => {
    if (score >= 70) return '#6b8e23' // Thriving - Greenish
    if (score >= 55) return '#e6c229' // Steady - Yellowish
    if (score >= 40) return '#e67b5e' // Stretched - Dawn (Orange)
    return '#c85250' // Depleted - Reddish
  }

  return (
    <motion.section 
      className="screen active"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ display: 'flex', paddingBottom: '60px' }}
    >
      <p className="eyebrow" style={{ textAlign: 'center' }}>The Mirror</p>
      <h1 className="headline" style={{ marginBottom: '40px' }}>Your systemic overview.</h1>

      {/* Care note first: safety renders before everything else (INV-06/08) */}
      {analysis?.safety?.care_note && (
        <div className="mirror-card care-note-card" style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid var(--lavender)',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(21,21,26,0.9) 100%)',
          borderRadius: '16px'
        }}>
          <p className="mirror-label bright" style={{ color: 'var(--lavender)', marginBottom: '12px' }}>A note of care</p>
          <p className="mirror-text" style={{ fontSize: '15px', lineHeight: '1.7', color: '#e2e8f0', margin: 0 }}>
            {analysis.safety.care_note}
          </p>
        </div>
      )}

      {dims && (
        <>
          {/* Prominent Resolution Card at the top */}
          <div className="mirror-card resolution-card" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '24px', 
            marginBottom: '32px',
            border: '1px solid var(--dawn)',
            background: 'linear-gradient(135deg, rgba(230,123,94,0.15) 0%, rgba(21,21,26,0.9) 100%)',
            boxShadow: '0 8px 32px rgba(230,123,94,0.15)',
            borderRadius: '16px'
          }}>
            <p className="mirror-label bright" style={{ color: 'var(--dawn)', marginBottom: '12px' }}>Your Resolution</p>
            <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px', fontWeight: '600' }}>{analysis?.prescription?.habit_title}</h3>
            <p className="mirror-text" style={{ fontSize: '15px', lineHeight: '1.6', color: '#e2e8f0', margin: 0 }}>
              {analysis?.prescription?.micro_action}
            </p>
          </div>

          <div className="mirror-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
            <p className="mirror-label bright">Resilience Radar</p>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(230,123,94,0.1), transparent 70%)', pointerEvents: 'none' }}></div>
            
            <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="var(--panel-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-mute)', fontSize: 11, letterSpacing: 0.5 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="You"
                    dataKey="A"
                    stroke="var(--dawn)"
                    fill="var(--dawn-glow)"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mirror-card" style={{ display: 'flex', flexDirection: 'column', padding: '30px', marginBottom: '24px' }}>
            <p className="mirror-label bright" style={{ alignSelf: 'flex-start' }}>The Wellbeing Landscape</p>
            <p className="mirror-text" style={{ fontSize: '14px', marginBottom: '24px' }}>Ranked from your strongest resources to the areas asking for attention.</p>
            
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradThriving" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradSteady" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fde047" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradStretched" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--dawn-glow)" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="var(--dawn)" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="gradDepleted" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#be123c" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    dataKey="subject" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 500, letterSpacing: '0.5px' }} 
                    width={130} 
                  />
                  <Tooltip 
                    cursor={{fill: 'var(--panel-border)', opacity: 0.2}} 
                    contentStyle={{ backgroundColor: 'rgba(21,21,26,0.9)', borderColor: 'var(--panel-border)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  <Bar 
                    dataKey="A" 
                    radius={[0, 8, 8, 0]} 
                    barSize={28}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {sortedData.map((entry, index) => {
                      let fillId = "url(#gradDepleted)"
                      if (entry.A >= 70) fillId = "url(#gradThriving)"
                      else if (entry.A >= 55) fillId = "url(#gradSteady)"
                      else if (entry.A >= 40) fillId = "url(#gradStretched)"
                      return <Cell key={`cell-${index}`} fill={fillId} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* The LLM Insight Report Rendered as Markdown */}
      <div className="mirror-card ai-report-content" style={{ marginBottom: '40px' }}>
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h2 className="mirror-label notice" style={{ marginTop: '32px', marginBottom: '16px', fontSize: '16px' }} {...props} />,
            h2: ({node, ...props}) => <h3 className="mirror-title" style={{ marginTop: '24px', marginBottom: '12px', fontSize: '18px' }} {...props} />,
            p: ({node, ...props}) => <p className="mirror-text" style={{ marginBottom: '16px', lineHeight: '1.6' }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-sub)' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: '8px' }} {...props} />,
            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--dawn)', paddingLeft: '16px', fontStyle: 'italic', color: 'var(--text-main)', background: 'var(--panel-border)', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px' }} {...props} />,
            strong: ({node, ...props}) => <strong style={{ color: 'var(--text-main)', fontWeight: 600 }} {...props} />
          }}
        >
          {analysis?.narrative}
        </ReactMarkdown>
      </div>

      <p className="closing-line">LEWIS reflects. It never diagnoses.</p>

    </motion.section>
  )
}
