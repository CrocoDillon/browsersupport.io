import { ImageResponse } from 'next/og'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: 180,
        height: 180,
        background: '#146b50',
        borderRadius: 40,
      }}
    >
      <svg width="180" height="180" viewBox="0 0 40 40">
        <path d="M2 13h36" stroke="#f6f8f2" opacity=".35" />
        <circle cx="9" cy="8" r="1.5" fill="#f6f8f2" />
        <circle cx="14" cy="8" r="1.5" fill="#f6f8f2" opacity=".5" />
        <path
          d="m11 24 6 6 12-12"
          fill="none"
          stroke="#f6f8f2"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    size
  )
}
