export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="36" height="34" rx="10" fill="currentColor" />
      <path d="M3 13h34" stroke="var(--paper)" strokeOpacity=".35" />
      <circle cx="10" cy="8.5" r="1.5" fill="var(--paper)" />
      <circle cx="15" cy="8.5" r="1.5" fill="var(--paper)" opacity=".45" />
      <path
        d="m12 24 5 5 11-11"
        stroke="var(--paper)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
