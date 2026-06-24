import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ClearMind — AI Notes That Organise Themselves'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 100%)', color: '#fafafa', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 96, height: 96, borderRadius: 24, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', marginBottom: 40, boxShadow: '0 20px 60px rgba(99,102,241,0.4)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 80, fontWeight: 800, letterSpacing: -3 }}>
          <span style={{ color: '#f8f8ff' }}>Clear</span><span style={{ color: '#818cf8' }}>Mind</span>
        </div>
        <div style={{ fontSize: 28, color: '#6b6b8a', marginTop: 20 }}>AI notes that organise themselves</div>
      </div>
    ),
    { ...size }
  )
}
