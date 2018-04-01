import { string } from 'prop-types'

import PropertyLink from '../PropertyLink'

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
      <PropertyLink name={parent}>
        <a>{parent}</a>
      </PropertyLink>
      {prototype ? (
        <PropertyLink name={`${parent}.prototype`}>
          <a>.prototype</a>
        </PropertyLink>
      ) : null}
      {name ? (
        <PropertyLink
          name={prototype ? `${parent}.prototype.${name}` : `${parent}.${name}`}
        >
          <a>.{name}</a>
        </PropertyLink>
      ) : null}
      {symbol ? (
        <PropertyLink
          name={
            prototype
              ? `${parent}.prototype[@@${symbol}]`
              : `${parent}[@@${symbol}]`
          }
        >
          <a>[@@{symbol}]</a>
        </PropertyLink>
      ) : null}
    </span>
  )
}

Breadcrumbs.displayName = 'Breadcrumbs'

Breadcrumbs.propTypes = {
  name: string.isRequired,
}

export default Breadcrumbs
