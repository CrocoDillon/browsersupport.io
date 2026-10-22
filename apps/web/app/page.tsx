import type { Metadata } from 'next'
import Link from 'next/link'
import { examples, propertyHref } from '@browsersupport/data'
import { InputError } from '@browsersupport/data/validation'
import { getStats, searchProperties } from './lib/catalog'
import { Search } from './components/search'
import { PropertyPath } from './components/property-path'
import { Arrow } from './components/mark'
type Params = { q?: string; page?: string; browse?: string }
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Params>
}): Promise<Metadata> {
  const { q, browse } = await searchParams
  return {
    alternates: { canonical: '/' },
    ...(q || browse
      ? {
          title: q ? 'Search: ' + q : 'Explore APIs',
          robots: { index: false, follow: true },
        }
      : {}),
  }
}
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Params>
}) {
  const { q, page, browse } = await searchParams
  if (q || browse) {
    let result
    try {
      result = await searchProperties(q, page)
    } catch (error) {
      if (error instanceof InputError)
        return (
          <section className="page-section">
            <h1>That search needs a small adjustment.</h1>
            <p>{error.message}</p>
            <Search query={q} />
          </section>
        )
      throw error
    }
    return (
      <section className="page-section">
        <div className="page-heading">
          <span className="eyebrow">THE API INDEX</span>
          <h1>{q ? 'Let’s look it up.' : 'A world of properties.'}</h1>
          <p className="lede">
            {q ? (
              <>
                {result.totalCount.toLocaleString('en')}{' '}
                {result.totalCount === 1 ? 'result' : 'results'} for{' '}
                <strong>“{q}”</strong>
              </>
            ) : (
              result.totalCount.toLocaleString('en') +
              ' JavaScript properties to explore.'
            )}
          </p>
        </div>
        <Search query={q} compact />
        {result.properties.length ? (
          <ul className="results-list">
            {result.properties.map(item => (
              <li key={item.name}>
                <PropertyPath name={item.name} />
                <Link
                  prefetch={false}
                  href={propertyHref(item.name)}
                  aria-label={'Explore ' + item.name}
                >
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <h2>No properties found.</h2>
            <p>
              Try a shorter name, like <Link href="/?q=String">String</Link> or{' '}
              <Link href="/?q=Array">Array</Link>. This is an archive, so newer
              APIs may not be here yet.
            </p>
          </div>
        )}
        <nav className="pagination" aria-label="Search pages">
          {result.page > 1 ? (
            <Link
              href={
                '/?q=' +
                encodeURIComponent(q || '') +
                '&browse=1&page=' +
                (result.page - 1)
              }
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span>
            Page {result.page.toLocaleString('en')} of{' '}
            {Math.max(
              1,
              Math.ceil(result.totalCount / result.perPage)
            ).toLocaleString('en')}
          </span>
          {result.page * result.perPage < result.totalCount &&
          result.page < 2000 ? (
            <Link
              href={
                '/?q=' +
                encodeURIComponent(q || '') +
                '&browse=1&page=' +
                (result.page + 1)
              }
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </section>
    )
  }
  const { count } = await getStats()
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            THE JAVASCRIPT API EXPLORER
          </div>
          <h1>
            Does it exist
            <br />
            in <span className="hero-emphasis">that browser?</span>
          </h1>
          <p className="lede">
            JavaScript has a lot of properties. Let’s find yours.
            <br className="desktop-break" /> Explore the familiar, the obscure,
            and everything in between.
          </p>
        </div>
        <div className="hero-specimen">
          <div className="specimen-chrome">
            <span />
            <span />
            <span />
            <span className="specimen-label">anatomy of an API</span>
          </div>
          <div className="specimen-content">
            <span className="code-comment">{'// follow your curiosity'}</span>
            <div className="specimen-path">
              <PropertyPath name="String.prototype.trimStart" />
            </div>
            <div className="specimen-tree">
              <Link href="/String">
                <span>01</span>String <small>the object</small>
              </Link>
              <Link href="/String.prototype">
                <span>02</span>.prototype <small>the shared bits</small>
              </Link>
              <Link href="/String.prototype.trimStart">
                <span>03</span>.trimStart <small>the property</small>
              </Link>
            </div>
            <p>
              Every part of the path is a link. Try it.{' '}
              <span aria-hidden="true">↗</span>
            </p>
          </div>
        </div>
      </section>
      <section className="home-search" aria-label="Find an API">
        <Search />
        <div className="search-hints">
          <span>Try a rabbit hole:</span>
          {['Array', 'String', 'Object', 'Window'].map(name => (
            <Link key={name} href={'/?q=' + name}>
              {name}
              <span aria-hidden="true"> ↗</span>
            </Link>
          ))}
          <Link className="browse-link" href="/?browse=1">
            Browse all APIs →
          </Link>
        </div>
      </section>
      <section className="examples-section">
        <div className="section-bar">
          <div>
            <span className="eyebrow">A FEW PLACES TO START</span>
            <h2>Small properties. Big possibilities.</h2>
          </div>
          <span className="catalog-count mono">
            {count.toLocaleString('en')} properties in the archive
          </span>
        </div>
        <div className="example-grid">
          {examples.map((example, i) => (
            <article className="example-card" key={example.name}>
              <div className="example-top">
                <span className="example-number mono">0{i + 1}</span>
                <span className="category-label">{example.category}</span>
                <Arrow />
              </div>
              <h3>
                <PropertyPath name={example.name} />
              </h3>
              <p>{example.description}</p>
              <Link
                prefetch={false}
                className="example-explore"
                href={propertyHref(example.name)}
              >
                Explore property <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="archive-note">
        <div>
          <span className="eyebrow">A NOTE FROM THE ARCHIVE</span>
          <h2>
            Old browsers.
            <br />
            Still interesting questions.
          </h2>
        </div>
        <div>
          <p>
            This project began with a simple idea: check which JavaScript
            properties actually exist in a browser. Even the prefixed ones. Even
            the weird ones.
          </p>
          <p>
            These are historical observations, not a verdict on today’s
            browsers. A property being present doesn’t mean its implementation
            is correct.
          </p>
          <Link href="/about">
            A little more about the project <Arrow />
          </Link>
        </div>
      </section>
    </>
  )
}
