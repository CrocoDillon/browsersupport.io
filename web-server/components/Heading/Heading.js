import { object, shape, string } from 'prop-types'
import Link from 'next/link'

import Breadcrumbs from '../Breadcrumbs'
import SearchForm from '../SearchForm'

import styles from './Heading.css'

const Heading = props => {
  let { property, children } = props

  if (property) {
    children = <Breadcrumbs name={property.name} />
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
