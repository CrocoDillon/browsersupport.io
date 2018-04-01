import { arrayOf, number, object, shape, string } from 'prop-types'
import Link from 'next/link'

import { propertyType } from '../../utils/propTypes'
import PropertyLink from '../PropertyLink'

import styles from './PropertyList.css'

const PropertyList = props => {
  const {
    properties,
    page,
    perPage,
    totalCount,
    url: { pathname, query },
  } = props
  const numberOfPages = Math.ceil(totalCount / perPage)
  const pages = []

  if (numberOfPages > 1) {
    pages.push(1)
    for (let i = -2; i <= 2; i++) {
      const p = page + i
      if (1 < p && p < numberOfPages) {
        if (p !== pages[pages.length - 1] + 1) {
          pages.push('ELLIPSIS_LEFT')
        }
        pages.push(p)
      }
    }
    if (numberOfPages !== pages[pages.length - 1] + 1) {
      pages.push('ELLIPSIS_RIGHT')
    }
    pages.push(numberOfPages)
  }

  const pagination =
    pages.length > 0 ? (
      <nav className={styles.pagination}>
        <ol>
          {pages.map(p => (
            <li key={p}>
              {typeof p == 'number' ? (
                p === page ? (
                  <span>{p}</span>
                ) : (
                  <Link href={{ pathname, query: { ...query, page: p } }}>
                    <a>{p}</a>
                  </Link>
                )
              ) : (
                '…'
              )}
            </li>
          ))}
        </ol>
      </nav>
    ) : null

  return (
    <div className={styles.PropertyList}>
      {pagination}
      <ol className={styles.list}>
        {properties.map(property => (
          <li key={property._id}>
            <PropertyLink name={property.name}>
              <a>{property.name}</a>
            </PropertyLink>
          </li>
        ))}
      </ol>
      {pagination}
    </div>
  )
}

PropertyList.displayName = 'PropertyList'

PropertyList.propTypes = {
  properties: arrayOf(propertyType).isRequired,
  page: number.isRequired,
  perPage: number.isRequired,
  totalCount: number.isRequired,
  url: shape({
    pathname: string.isRequired,
    query: object.isRequired,
  }).isRequired,
}

export default PropertyList
