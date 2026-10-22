'use client'
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="page-section empty-state">
      <span className="eyebrow">A SMALL INTERRUPTION</span>
      <h1>The archive is taking a moment.</h1>
      <p>
        We couldn’t load the compatibility data. Please try again in a little
        while.
      </p>
      <button className="pill" onClick={reset}>
        Try again
      </button>
    </section>
  )
}
