import { bool } from 'prop-types'
import Link from 'next/link'
import cn from 'classnames'

import { propertyType } from '../../utils/propTypes'

import Breadcrumbs from '../Breadcrumbs'
import SearchForm from '../SearchForm'

import styles from './Heading.css'

const Heading = props => {
  let { index, property, children } = props

  if (index) {
    children = (
      <Link href="/">
        <a className={styles.loudLink}>browsersupport.io</a>
      </Link>
    )
  }

  if (property) {
    children = <Breadcrumbs name={property.name} />
  }

  const className = cn(styles.Heading, {
    [styles.index]: index,
  })

  return (
    <header className={className}>
      <h1>{children}</h1>
      <div className={styles.search}>
        <SearchForm />
      </div>
      {index ? null : (
        <Link href="/" prefetch>
          <a className={styles.link}>browsersupport.io</a>
        </Link>
      )}
    </header>
  )
}

Heading.displayName = 'Heading'

Heading.propTypes = {
  index: bool,
  property: propertyType,
}

export default Heading
