'use client'
import { useState } from 'react'
export function Copy({ text }: { text: string }) {
  const [status, setStatus] = useState('Copy path')
  return (
    <button
      className="text-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setStatus('Copied!')
        } catch {
          setStatus('Could not copy')
        }
      }}
      aria-live="polite"
    >
      {status} <span aria-hidden="true">⧉</span>
    </button>
  )
}
