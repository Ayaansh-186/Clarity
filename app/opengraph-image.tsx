import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ClearMind — AI Notes App | Your Self-Organizing Second Brain'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D0D1A 0%, #13131F 60%, #1a1030 100%)',
          color: '#fafafa',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          top: -100, left: -100,
          borderRadius: '50%',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
          bottom: -80, right: 100,
          borderRadius: '50%',
          display: 'flex',
        }} />

        {/* Logo icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 96,
          height: 96,
          borderRadius: 24,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          marginBottom: 32,
          boxShadow: '0 20px 60px rgba(99,102,241,0.45)',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 88, fontWeight: 800, letterSpacing: -4, marginBottom: 16 }}>
          <span style={{ color: '#F0EFFE' }}>Clear</span>
          <span style={{ color: '#818cf8' }}>Mind</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 28, color: '#6b6b8a', marginBottom: 40, letterSpacing: -0.5 }}>
          Your self-organising AI workspace
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['✦ Auto-clustering', '🎙 Voice capture', '🔗 Related notes', '⌘ Cmd+K'].map(pill => (
            <div key={pill} style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 99,
              padding: '8px 18px',
              fontSize: 16,
              color: '#818cf8',
              fontWeight: 600,
              display: 'flex',
            }}>
              {pill}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 15,
          color: '#374151',
        }}>
          <span>clarity-delta-two.vercel.app</span>
          <span>·</span>
          <span>Free · No credit card</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
