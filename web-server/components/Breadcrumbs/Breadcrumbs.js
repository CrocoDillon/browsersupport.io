import { string } from 'prop-types'
import Link from 'next/link'

import styles from './Breadcrumbs.css'

const nameRe = /^([a-z]\w*)(?:\.(prototype))?(?:\.([a-z_-][\w-]*)|\[@@([a-z]+)\])?$/i

const Breadcrumbs = props => {
  const { name: propertyName } = props

  const destructured = propertyName.match(nameRe)

  if (destructured === null) {
    // Too bad
    return <span className={styles.Breadcrumbs}>{propertyName}</span>
  }

  const [, parent, prototype, name, symbol] = destructured

  return (
    <span className={styles.Breadcrumbs}>
      <Link href={`/property?name=${parent}`} as={`/${parent}`}>
        <a>{parent}</a>
      </Link>
      {prototype ? (
        <Link
          href={`/property?name=${parent}.prototype`}
          as={`/${parent}.prototype`}
        >
          <a>.prototype</a>
        </Link>
      ) : null}
      {name ? (
        <Link
          href={
            prototype
              ? `/property?name=${parent}.prototype.${name}`
              : `/property?name=${parent}.${name}`
          }
          as={prototype ? `/${parent}.prototype.${name}` : `/${parent}.${name}`}
        >
          <a>.{name}</a>
        </Link>
      ) : null}
      {symbol ? (
        <Link
          href={
            prototype
              ? `/property?name=${parent}.prototype[@@${symbol}]`
              : `/property?name=${parent}[@@${symbol}]`
          }
          as={
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

Breadcrumbs.displayName = 'Breadcrumbs'

Breadcrumbs.propTypes = {
  name: string.isRequired,
}

export default Breadcrumbs
