'use client'
import Form from 'next/form'
import { useEffect, useRef } from 'react'
export function Search({
  query = '',
  compact = false,
}: {
  query?: string
  compact?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !target.closest('input, textarea, select, [contenteditable]')
      ) {
        event.preventDefault()
        input.current?.focus()
      }
      if (event.key === 'Escape' && document.activeElement === input.current)
        input.current?.blur()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [])
  return (
    <Form
      action="/"
      className={compact ? 'search search-compact' : 'search'}
      role="search"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="10.7"
          cy="10.7"
          r="6.7"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="m16 16 5 5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      <label htmlFor="api-search" className="sr-only">
        Search JavaScript APIs
      </label>
      <input
        ref={input}
        id="api-search"
        type="search"
        name="q"
        maxLength={120}
        placeholder="Try String.prototype.trimStart"
        defaultValue={query}
        key={query}
        autoComplete="off"
        spellCheck={false}
      />
      <kbd aria-hidden="true">/</kbd>
      <button type="submit">
        Search <span aria-hidden="true">↗</span>
      </button>
    </Form>
  )
}
