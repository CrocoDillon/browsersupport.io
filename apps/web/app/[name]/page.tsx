import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { propertyHref, segments } from '@browsersupport/data'
import { InputError, validName } from '@browsersupport/data/validation'
import { findProperty, relatedProperties, suggestions } from '../lib/catalog'
import { PropertyPath } from '../components/property-path'
import { SupportTable } from '../components/support-table'
import { Search } from '../components/search'
import { Copy } from '../components/copy'
export const revalidate = 3600
type Props = { params: Promise<{ name: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  return {
    title: name,
    description:
      'Recorded browser observations for ' +
      name +
      '. Property presence checks, with historical results kept in context.',
    alternates: { canonical: propertyHref(name) },
  }
}
export default async function PropertyPage({ params }: Props) {
  const { name } = await params
  try {
    validName(name)
  } catch (error) {
    if (error instanceof InputError) notFound()
    throw error
  }
  const property = await findProperty(name)
  if (!property) {
    const matches = await suggestions(name)
    if (matches.length === 1) redirect(propertyHref(matches[0].name))
    if (matches.length > 1)
      return (
        <section className="page-section">
          <h1>A few possible matches.</h1>
          <ul className="results-list">
            {matches.map(match => (
              <li key={match.name}>
                <PropertyPath name={match.name} />
              </li>
            ))}
          </ul>
        </section>
      )
    notFound()
  }
  const related = await relatedProperties(name)
  const parts = segments(name)
  return (
    <section className="property-page">
      <div className="property-toolbar">
        <Link href="/?browse=1">← All properties</Link>
        <Copy text={name} />
      </div>
      <div className="property-heading">
        <span className="eyebrow">
          JAVASCRIPT /{' '}
          {name.endsWith('.prototype')
            ? 'PROTOTYPE'
            : name.includes('.prototype')
              ? 'INSTANCE PROPERTY'
              : parts.length > 1
                ? 'STATIC PROPERTY'
                : 'GLOBAL'}
        </span>
        <h1>
          <PropertyPath name={name} />
        </h1>
        <p className="lede">
          {parts.length > 1
            ? 'Follow any part of the path to explore its parent.'
            : 'Start here, then follow its properties a little further.'}
        </p>
      </div>
      <SupportTable property={property} />
      <aside className="data-note">
        <span className="note-icon" aria-hidden="true">
          i
        </span>
        <div>
          <strong>A snapshot, not a promise.</strong>
          <p>
            These tests check whether a property exists. They don’t test
            behavior, bugs, secure-context requirements, or browser settings.
            Missing results mean unknown, not unsupported. For current
            compatibility guidance, check{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
              MDN
            </a>
            .
          </p>
        </div>
      </aside>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-bar">
            <div>
              <span className="eyebrow">KEEP EXPLORING</span>
              <h2>A little further down the path.</h2>
            </div>
            <Link href={'/?q=' + encodeURIComponent(name + '.')}>
              Search this object →
            </Link>
          </div>
          <ul className="related-grid">
            {related.map(item => (
              <li key={item.name}>
                <PropertyPath name={item.name} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="property-search">
        <h2>Something else on your mind?</h2>
        <Search compact />
      </div>
    </section>
  )
}
