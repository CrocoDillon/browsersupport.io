import Link from 'next/link'

import styles from './Suggestions.css'

const sort = (a, b) => {
  if (a.name > b.name) {
    return 1
  }

  if (a.name < b.name) {
    return -1
  }

  return 0
}

const Suggestions = props => {
  const { suggestions } = props

  return (
    <div>
      <p>But we may have some suggestions for you</p>
      <ul className={styles.list}>
        {suggestions.sort(sort).map(suggestion => (
          <li key={suggestion._id}>
            <Link
              href={`/property?name=${encodeURIComponent(suggestion.name)}`}
              as={`/${suggestion.name}`}
              prefetch
            >
              <a className={styles.link}>{suggestion.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

Suggestions.displayName = 'Suggestions'

export default Suggestions
