import { object, shape, string } from 'prop-types'
import Link from 'next/link'

import SearchForm from '../SearchForm'

import styles from './Heading.css'

const propertyRe = /^([a-z]\w*)(?:\.(prototype))?(?:\.([a-z_-][\w-]*)|\[@@([a-z]+)\])?$/i

const Heading = props => {
  let { property, children } = props

  if (property) {
    const destructured = property.name.match(propertyRe)

    if (destructured) {
      const [, parent, prototype, name, symbol] = destructured

      children = (
        <span className={styles.breadcrumbs}>
          <Link href={`/${parent}`}>
            <a>{parent}</a>
          </Link>
          {prototype ? (
            <Link href={`/${parent}.prototype`}>
              <a>.prototype</a>
            </Link>
          ) : null}
          {name ? (
            <Link
              href={
                prototype
                  ? `/${parent}.prototype.${name}`
                  : `/${parent}.${name}`
              }
            >
              <a>.{name}</a>
            </Link>
          ) : null}
          {symbol ? (
            <Link
              href={
                prototype
                  ? `/${parent}.prototype[@@${symbol}]`
                  : `/${parent}[@@${symbol}]`
              }
            >
              <a>[@@{symbol}]</a>
            </Link>
          ) : null}
        </span>
      )
    }
  }

  return (
    <header className={styles.Heading}>
      <h1>{children}</h1>
      <div className={styles.search}>
        <SearchForm />
      </div>
      <Link href="/" prefetch>
        <a className={styles.link}>browsersupport.io</a>
      </Link>
    </header>
  )
}

Heading.displayName = 'Heading'

Heading.propTypes = {
  property: shape({
    _id: string.isRequired,
    name: string.isRequired,
    browsers: object,
  }),
}

export default Heading
