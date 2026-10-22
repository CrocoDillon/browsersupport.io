import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'browsersupport.io — Does it exist in that browser?'
export default function OpenGraph() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: '#f6f8f2',
        color: '#1b332c',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, color: '#146b50' }}>
        browsersupport.io
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 88,
          fontWeight: 700,
          letterSpacing: -5,
          lineHeight: 1.05,
        }}
      >
        <span>Does it exist</span>
        <span style={{ color: '#146b50' }}>in that browser?</span>
      </div>
      <div style={{ display: 'flex', fontSize: 25 }}>
        JavaScript APIs, one property at a time.
      </div>
    </div>,
    size
  )
}
