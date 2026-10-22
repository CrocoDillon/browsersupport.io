import Link from 'next/link'
import { Search } from './components/search'
export default function NotFound() {
  return (
    <section className="page-section empty-state">
      <span className="eyebrow">404 / PROPERTY NOT FOUND</span>
      <h1>
        Even this archive
        <br />
        has its limits.
      </h1>
      <p className="lede">
        That property isn’t in the collection. Check its spelling and
        capitalization, or try a shorter name.
      </p>
      <Search compact />
      <Link className="back-link" href="/">
        ← Back to exploring
      </Link>
    </section>
  )
}
