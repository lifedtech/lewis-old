import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLewisStore } from '../store/useLewisStore.js'

export default function StreamlinedInsightReport() {
  const { streamlinedRRO, name, setScreen } = useLewisStore()
  const reportRef = useRef(null)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  const displayName = name || streamlinedRRO?.meta?.name || 'Friend'

  // Standardized RRO fallback data with all 11 sections
  const rro = streamlinedRRO || {
    meta: {
      name: displayName,
      date_display: 'Today',
      rro_id: 'LSR2026'
    },
    dimensions: [
      { key: 'PH', label: 'Body and recovery', score: 23, band: 1, why: 'Sleep is not restoring you, minimal movement.' },
      { key: 'EM', label: 'Emotional calm', score: 27, band: 1, why: 'Mind feels constantly busy, difficulty settling.' },
      { key: 'FW', label: 'Money and security', score: 25, band: 1, why: 'Money worry sits with you most days.' },
      { key: 'IG', label: 'Curiosity and learning', score: 37, band: 1, why: 'No mental space or time for new learning.' },
      { key: 'EN', label: 'Energy and drive', score: 50, band: 2, why: 'Energy runs out long before the day does.' },
      { key: 'EC', label: 'Surroundings and belonging', score: 44, band: 2, why: 'Rare outdoor time and feeling somewhat out of place.' },
      { key: 'RS', label: 'Relationships', score: 67, band: 3, why: 'Close connection with family holds strong.' },
      { key: 'MS', label: 'Meaning and purpose', score: 65, band: 3, why: 'Sense of direction and purpose remains intact.' },
      { key: 'AC', label: 'Progress and agency', score: 56, band: 3, why: 'Holding capability to handle daily challenges.' }
    ],
    priority: {
      top3: ['Emotional calm', 'Body and recovery', 'Money and security'],
      tension_key: 'PH'
    },
    root_driver: {
      key: 'PH',
      label: 'Body and recovery',
      leverage: 8.4,
      why_this: 'Your physical rest and recovery sit at the centre of how daily strain spreads across your profile.',
      why_not_lowest: 'Restoring sleep and physical ease gives you the highest leverage across your emotional and cognitive capacity.'
    },
    suggestion: {
      cue: 'Tonight, after you put your phone on charge',
      action: 'step outside for five minutes before you sit back down',
      size_tier: 'S0',
      evidence_tier: 'established',
      dose_honesty: 'Regular physical activity has a consistent, well replicated effect on low mood and distress across randomised trials. We are starting you below the researched dose on purpose, because a 5-minute thing you actually do beats a 10-minute thing you do not.'
    },
    somatic: {
      zones: ['Head and neck', 'Shoulders and back', 'Chest', 'Stomach'],
      portrait: 'Activated',
      cluster: 'The Surge',
      recovery: 'Somewhat better',
      tension_before: 8,
      tension_after: 5
    },
    links: [
      {
        source: 'PH',
        target: 'EM',
        title: 'Sleep and emotional load',
        badge: 'Strongest, directional',
        evidence: 'established',
        body: 'Your sleep and emotional load are showing up together. In research, short or broken sleep reliably makes it harder to regulate mood the next day. Movement also has a direct regulatory effect on emotional distress.'
      },
      {
        source: 'FW',
        target: 'EM',
        title: 'Money and emotional load',
        badge: 'Second, no direction',
        evidence: 'supported',
        body: 'Money and emotional load are sitting together in your answers. Research finds these two travel together consistently, each feeding the other.'
      },
      {
        source: 'EC',
        target: 'PH',
        title: 'Surroundings, and both your body and your mood',
        badge: 'Two faint links',
        evidence: 'supported',
        body: 'You rarely get outdoors. Short, repeated time outside, even ten minutes, moves fatigue and vitality measurably.'
      }
    ]
  }

  const dimensions = rro.dimensions || []
  const rootDriver = rro.root_driver || {}
  const suggestion = rro.suggestion || {}
  const somatic = rro.somatic || {}
  const links = rro.links || []

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const res = await fetch(`${API_BASE}/api/reports/streamlined/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rro: rro,
          name: displayName,
          report_id: rro?.meta?.rro_id || 'LEWIS-Report'
        })
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `LEWIS-Insight-Report-${displayName.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        setIsDownloadingPdf(false)
        setTimeout(() => window.print(), 100)
      }
    } catch (e) {
      console.warn('PDF download failed, falling back to browser print:', e)
      setIsDownloadingPdf(false)
      setTimeout(() => window.print(), 100)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const getBandBadge = (band) => {
    if (band >= 4) return { label: 'A real strength', color: '#5fbb46', bg: '#e6f4d0' }
    if (band === 3) return { label: 'Holding', color: '#00786d', bg: '#d6edea' }
    if (band === 2) return { label: 'Stretched', color: '#b07c22', bg: '#faf0dc' }
    return { label: 'Running on empty', color: '#b45f38', bg: '#f7e8e0' }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background, #f6fbf9)',
      color: '#414242',
      fontFamily: "'Nunito', system-ui, sans-serif",
      padding: '30px 16px 80px',
      boxSizing: 'border-box',
    }}>
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="no-print" style={{
        maxWidth: '820px',
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, color: 'var(--dawn, #00ae9d)', fontSize: '18px' }}>
            LEWIS
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#657370' }}>
            · Insight Report
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: '#414242',
              fontSize: '13px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            style={{
              padding: '8px 20px',
              borderRadius: '100px',
              border: 'none',
              background: 'var(--dawn, #00ae9d)',
              color: '#ffffff',
              fontSize: '13px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 174, 157, 0.25)',
            }}
          >
            {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF ↓'}
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <div
        ref={reportRef}
        className="report-page-container streamlined-report-card"
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '48px 40px',
          border: '1px solid #ededed',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          boxSizing: 'border-box',
        }}
      >
        {/* ============================================================ */}
        {/* COVER SECTION                                                */}
        {/* ============================================================ */}
        <section className="report-section" style={{ paddingBottom: '36px', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '18px', borderBottom: '1px solid #ededed' }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: '24px', color: '#00ae9d' }}>LEWIS</span>
            <span style={{ font: "700 10.5px/1 'Nunito',sans-serif", letterSpacing: '.2em', textTransform: 'uppercase', color: '#00ae9d' }}>Wellbeing Intelligence</span>
          </div>

          <div style={{ padding: '32px 0 0' }}>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.22em', textTransform: 'uppercase', color: '#a8a8a8' }}>Insight report</span>
            <h1 style={{ margin: '8px 0 12px', font: "800 clamp(36px, 4.5vw, 54px)/1.05 'Manrope',sans-serif", letterSpacing: '-.03em', color: '#414242' }}>Your reflection.</h1>
            <p style={{ margin: '0 0 20px', font: "400 16px/1.6 'Nunito',sans-serif", color: '#5f6060', maxWidth: '48ch' }}>
              Nine areas of your life, read back to you from your own answers. Where things sit, how they connect, and the one place a small change reaches furthest.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', height: '30px', padding: '0 14px', borderRadius: '100px', background: '#d6edea', font: "700 12px 'Nunito',sans-serif", color: '#00786d' }}>{displayName}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', height: '30px', padding: '0 14px', borderRadius: '100px', background: '#f4f4f4', font: "600 12px 'Nunito',sans-serif", color: '#5f6060' }}>{rro.meta?.date_display || 'Today'}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', height: '30px', padding: '0 14px', borderRadius: '100px', background: '#f4f4f4', font: "600 12px 'Nunito',sans-serif", color: '#5f6060' }}>39 answers · 11 sections</span>
            </div>
          </div>

          {/* Petal Diagram Visual */}
          <div style={{ display: 'grid', placeItems: 'center', padding: '24px 0 8px' }}>
            <svg viewBox="-190 -190 380 380" width="100%" style={{ maxWidth: '340px', display: 'block' }}>
              <g fill="none" stroke="#ededed" strokeWidth="1">
                <circle cx="0" cy="0" r="57" /><circle cx="0" cy="0" r="88" /><circle cx="0" cy="0" r="119" /><circle cx="0" cy="0" r="150" />
              </g>
              <g stroke="#ffffff" strokeWidth="1.25">
                <path d="M0,0 C10.1,-13.6 9,-39.3 0,-54.5 C-9,-39.3 -10.1,-13.6 0,0" fill="#cf7f5e" fillOpacity=".78" />
                <path d="M0,0 C18,-4.3 35,-26.5 38.2,-45.6 C20,-39.1 1.1,-18.5 0,0" fill="#cf7f5e" fillOpacity=".78" />
                <path d="M0,0 C24.5,12.3 64.9,3.3 86.7,-15.3 C59.9,-25.3 18.8,-19.9 0,0" fill="#d9a44a" fillOpacity=".78" />
                <path d="M0,0 C13.5,31.2 59,54.9 94.5,54.5 C77,23.7 33.8,-3.9 0,0" fill="#00ae9d" fillOpacity=".82" />
                <path d="M0,0 C-9.5,31.8 9.7,78.1 36.5,100.2 C42.8,66.1 27.7,18.3 0,0" fill="#00ae9d" fillOpacity=".82" />
                <path d="M0,0 C-24.8,16.3 -38.3,59.2 -32.6,89.7 C-8.7,70 8.5,28.5 0,0" fill="#00ae9d" fillOpacity=".82" />
                <path d="M0,0 C-17.6,-2.1 -40.2,12.4 -49.4,28.5 C-30.8,28.7 -7,16.3 0,0" fill="#cf7f5e" fillOpacity=".78" />
                <path d="M0,0 C-15.4,-16.3 -48.9,-20.7 -70.8,-12.5 C-53,2.7 -20,10 0,0" fill="#cf7f5e" fillOpacity=".78" />
                <path d="M0,0 C-1.5,-25.1 -27.1,-53 -51.8,-61.7 C-47.5,-35.9 -24.4,-5.8 0,0" fill="#d9a44a" fillOpacity=".78" />
              </g>
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 01: WHERE THIS STARTS                                */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>01</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>Where this starts</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <p style={{ margin: '0 0 20px', font: "400 24px/1.4 'Manrope',sans-serif", color: '#414242' }}>
            You arrived here describing yourself as <strong style={{ color: '#00786d' }}>stretched</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <p style={{ margin: 0, font: "400 14.5px/1.7 'Nunito',sans-serif", color: '#5f6060' }}>
              Some of what follows is hard, and none of it is a verdict on you.
            </p>
            <div style={{ padding: '16px 20px', borderRadius: '16px', background: '#d6edea' }}>
              <p style={{ margin: 0, font: "700 14px/1.55 'Nunito',sans-serif", color: '#00786d' }}>
                This describes the season you are in, not the kind of person you are.
              </p>
            </div>
          </div>

          <div style={{ padding: '22px 24px', borderRadius: '18px', border: '1px solid #ededed' }}>
            <span style={{ font: "700 10.5px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>
              What matters most to you right now
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '14px' }}>
              {(rro.priority?.top3 || ['Emotional calm', 'Body and recovery', 'Money and security']).map((topItem) => (
                <div key={topItem} style={{ padding: '14px', borderRadius: '12px', background: '#f7e8e0', textAlign: 'center' }}>
                  <p style={{ margin: 0, font: "700 13.5px 'Nunito',sans-serif", color: '#414242' }}>{topItem}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '16px 0 0', font: "400 14px/1.7 'Nunito',sans-serif", color: '#5f6060' }}>
              Your answers point to <strong>{rootDriver.label || 'Body and recovery'}</strong> as the area furthest from where you want it to be.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 02: THE SHAPE OF YOUR WELLBEING                      */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>02</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>The shape of your wellbeing</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <h2 style={{ font: "800 24px/1.2 'Manrope',sans-serif", color: '#414242', margin: '0 0 16px' }}>
            Nine Areas Distribution
          </h2>

          <div style={{ display: 'grid', gap: '8px' }}>
            {dimensions.map((d) => {
              const badge = getBandBadge(d.band)
              return (
                <div
                  key={d.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '14px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <span style={{ font: "700 14px 'Nunito',sans-serif", color: '#414242' }}>{d.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: '24px',
                      padding: '0 10px',
                      borderRadius: '100px',
                      background: badge.bg,
                      color: badge.color,
                      font: "700 11.5px 'Nunito',sans-serif",
                    }}>
                      {badge.label}
                    </span>
                    <span style={{ font: "800 14px 'Nunito',sans-serif", color: '#414242', width: '28px', textAlign: 'right' }}>
                      {d.score}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 03: WHAT EACH AREA ASKS OF YOU                       */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>03</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>What each area asks of you</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {dimensions.slice(0, 4).map((d) => (
              <div key={d.key} style={{ padding: '18px 20px', borderRadius: '16px', background: '#f7e8e0', border: '1px solid rgba(207,127,94,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ font: "800 14.5px 'Manrope',sans-serif", color: '#414242' }}>{d.label}</span>
                  <span style={{ font: "800 18px 'Nunito',sans-serif", color: '#cf7f5e' }}>{d.score}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '3px', background: '#ffffff', margin: '10px 0 12px' }}>
                  <div style={{ width: `${d.score}%`, height: '4px', borderRadius: '3px', background: '#cf7f5e' }} />
                </div>
                <p style={{ margin: 0, font: "400 13px/1.6 'Nunito',sans-serif", color: '#5f6060' }}>
                  {d.why || 'Carrying noticeable load in recent weeks.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 04: SOMATIC TENSION MAP                              */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>04</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>Where tension settles in your body</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start' }}>
            <div style={{ padding: '20px', borderRadius: '18px', border: '1px solid #ededed' }}>
              <span style={{ font: "700 10.5px 'Nunito',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', color: '#a8a8a8' }}>Your inner state</span>
              <p style={{ margin: '8px 0 4px', font: "800 20px 'Manrope',sans-serif", color: '#cf7f5e' }}>{somatic.portrait || 'Activated'}</p>
              <p style={{ margin: '0 0 14px', font: "400 13.5px 'Nunito',sans-serif", color: '#5f6060' }}>Wired, alert, and on edge.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#f4f4f4', font: "600 11.5px 'Nunito',sans-serif", color: '#5f6060' }}>Pattern: {somatic.cluster || 'The Surge'}</span>
                <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#f4f4f4', font: "600 11.5px 'Nunito',sans-serif", color: '#5f6060' }}>Felt in: {(somatic.zones || ['Head & neck', 'Shoulders']).join(', ')}</span>
              </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '18px', background: '#d6edea' }}>
              <span style={{ font: "700 10.5px 'Nunito',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', color: '#00786d' }}>One minute of breathing</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '14px 0 10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ font: "800 22px 'Manrope',sans-serif", color: '#00786d' }}>{somatic.tension_before || 8}</span>
                  <span style={{ display: 'block', font: "700 11px 'Nunito',sans-serif", color: '#00786d' }}>Before</span>
                </div>
                <span style={{ color: '#00786d', fontWeight: 800 }}>→</span>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ font: "800 22px 'Manrope',sans-serif", color: '#00786d' }}>{somatic.tension_after || 5}</span>
                  <span style={{ display: 'block', font: "700 11px 'Nunito',sans-serif", color: '#00786d' }}>After</span>
                </div>
              </div>
              <p style={{ margin: 0, font: "400 13px/1.6 'Nunito',sans-serif", color: '#00786d' }}>
                Your tension settled from {somatic.tension_before || 8} to {somatic.tension_after || 5}. A tangible indicator that your nervous system can down-regulate with conscious pacing.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 05: YOUR DAILY RHYTHM                                */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>05</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>Your day, as you described it</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {['Morning (High)', 'Afternoon (Low)', 'Evening (Medium)', 'Night (Low)'].map((p) => (
              <div key={p} style={{ padding: '12px 8px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <span style={{ font: "700 12.5px 'Nunito',sans-serif", color: '#414242' }}>{p}</span>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, font: "400 14px/1.65 'Nunito',sans-serif", color: '#5f6060' }}>
            You fall asleep slowly. Your energy has a distinct morning peak, followed by steep afternoon depletion that is not restored by evening rest.
          </p>
        </section>

        {/* ============================================================ */}
        {/* SECTION 06: HOW STRAIN TRAVELS (LINK GRAPH)                  */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>06</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>How strain in one area arrives in the next</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {links.map((link) => (
              <div key={link.title} style={{ padding: '18px 20px', borderRadius: '16px', background: '#d6edea', border: '1px solid rgba(0,174,157,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ font: "800 15px 'Manrope',sans-serif", color: '#00786d' }}>{link.title}</span>
                  <span style={{ font: "700 10.5px 'Nunito',sans-serif", letterSpacing: '.08em', textTransform: 'uppercase', color: '#00ae9d', background: '#ffffff', padding: '3px 8px', borderRadius: '6px' }}>{link.badge}</span>
                </div>
                <p style={{ margin: 0, font: "400 13.5px/1.65 'Nunito',sans-serif", color: '#004d44' }}>
                  {link.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 07: WHERE ONE CHANGE REACHES FURTHEST                */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>07</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>Where one change reaches furthest</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <h2 style={{ font: "800 28px/1.2 'Manrope',sans-serif", color: '#00786d', margin: '0 0 6px' }}>
            {rootDriver.label || 'Body and recovery.'}
          </h2>
          <p style={{ font: "400 15px/1.6 'Nunito',sans-serif", color: '#5f6060', margin: '0 0 20px' }}>
            Not the one that hurts most. The one most connected to the rest.
          </p>

          <div style={{ padding: '20px 22px', borderRadius: '16px', background: '#d6edea' }}>
            <span style={{ font: "700 10.5px/1 'Nunito',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', color: '#00786d' }}>Where we point</span>
            <p style={{ margin: '8px 0 0', font: "400 14px/1.65 'Nunito',sans-serif", color: '#004d44' }}>
              The one place where the primary barrier is time. Time is the barrier a small enough habit can get underneath.
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 08: GROUND YOU CAN RELY ON                           */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>08</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>Ground you can rely on</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '14px', background: '#d6edea', textAlign: 'center' }}>
              <span style={{ font: "800 22px 'Manrope',sans-serif", color: '#00786d' }}>67</span>
              <p style={{ margin: '4px 0 0', font: "700 13px 'Nunito',sans-serif", color: '#00786d' }}>Relationships</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '14px', background: '#d6edea', textAlign: 'center' }}>
              <span style={{ font: "800 22px 'Manrope',sans-serif", color: '#00786d' }}>65</span>
              <p style={{ margin: '4px 0 0', font: "700 13px 'Nunito',sans-serif", color: '#00786d' }}>Meaning &amp; purpose</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '14px', background: '#d6edea', textAlign: 'center' }}>
              <span style={{ font: "800 22px 'Manrope',sans-serif", color: '#00786d' }}>56</span>
              <p style={{ margin: '4px 0 0', font: "700 13px 'Nunito',sans-serif", color: '#00786d' }}>Progress &amp; agency</p>
            </div>
          </div>
          <p style={{ margin: 0, font: "400 14px/1.65 'Nunito',sans-serif", color: '#5f6060' }}>
            Your sense of direction and personal resilience are intact. In a challenging season, these three are the steady ground the rest of this stands on.
          </p>
        </section>

        {/* ============================================================ */}
        {/* SECTION 09: THE ONE THING (MICRO-ACTION)                     */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>09</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>The one thing</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <p style={{ margin: '0 0 16px', font: "400 15px 'Nunito',sans-serif", color: '#5f6060' }}>
            You told us you want one thing to focus on, not a complicated plan.
          </p>

          <div style={{ padding: '26px 28px', borderRadius: '20px', background: 'var(--dawn, #00ae9d)', color: '#ffffff', marginBottom: '16px' }}>
            <span style={{ font: "700 10.5px/1 'Nunito',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.25)', padding: '3px 10px', borderRadius: '6px' }}>
              Cue → Action
            </span>
            <h3 style={{ font: "800 24px/1.3 'Manrope',sans-serif", color: '#ffffff', margin: '12px 0 8px' }}>
              {suggestion.cue || 'Tonight, after you put your phone on charge'}: {suggestion.action || 'step outside for five minutes before you sit back down'}.
            </h3>
            <p style={{ margin: 0, font: "400 13.5px/1.6 'Nunito',sans-serif", color: 'rgba(255,255,255,0.9)' }}>
              {suggestion.dose_honesty}
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 10: CONFIDENCE & PSYCHOMETRIC TRANSPARENCY           */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0', borderBottom: '1px solid #ededed' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>10</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>How confident this report is, area by area</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: '#f9fafb' }}>
              <span style={{ font: "700 13.5px 'Nunito',sans-serif", color: '#414242' }}>Emotional calm</span>
              <span style={{ font: "600 12.5px 'Nunito',sans-serif", color: '#00ae9d' }}>Well supported (10-item PSS-10)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: '#f9fafb' }}>
              <span style={{ font: "700 13.5px 'Nunito',sans-serif", color: '#414242' }}>Progress and agency</span>
              <span style={{ font: "600 12.5px 'Nunito',sans-serif", color: '#00ae9d' }}>Well supported (6-item GSE-6)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: '#f9fafb' }}>
              <span style={{ font: "700 13.5px 'Nunito',sans-serif", color: '#414242' }}>Relationships</span>
              <span style={{ font: "600 12.5px 'Nunito',sans-serif", color: '#00ae9d' }}>Reasonably supported (UCLA-3)</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 11: WHAT WE USED & NON-CLINICAL NOTE                 */}
        {/* ============================================================ */}
        <section className="report-section" style={{ padding: '36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ font: "800 11px/1 'Nunito',sans-serif", letterSpacing: '.2em', color: '#00ae9d' }}>11</span>
            <span style={{ font: "700 11px/1 'Nunito',sans-serif", letterSpacing: '.16em', textTransform: 'uppercase', color: '#a8a8a8' }}>What we used</span>
            <span style={{ flex: 1, height: '1px', background: '#ededed' }}></span>
          </div>

          <div style={{ padding: '18px 20px', borderRadius: '16px', background: '#f4f4f4' }}>
            <p style={{ margin: '0 0 8px', font: "800 14px 'Nunito',sans-serif", color: '#414242' }}>What this is not</p>
            <p style={{ margin: 0, font: "400 13px/1.65 'Nunito',sans-serif", color: '#5f6060' }}>
              LEWIS is a private, non-clinical wellbeing reflection tool. It does not diagnose any condition, makes no claim about physiological pathology, and is not a substitute for speaking with a qualified medical professional or therapist.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ paddingTop: '24px', borderTop: '1px solid #ededed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ font: "400 11.5px 'Nunito',sans-serif", color: '#9ca3af' }}>{displayName} · Private to you · LEWIS Insight Report</span>
          <span style={{ font: "700 11.5px 'Nunito',sans-serif", color: '#00ae9d' }}>LEWIS Wellbeing</span>
        </footer>
      </div>
    </div>
  )
}
