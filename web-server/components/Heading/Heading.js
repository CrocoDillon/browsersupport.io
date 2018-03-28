import Link from 'next/link'

import SearchForm from '../SearchForm'

import styles from './Heading.css'

const Heading = props => {
  const { children } = props

  return (
    <header className={styles.Heading}>
      <h1>{children}</h1>
      <SearchForm />
      <Link href="/" prefetch>
        <a className={styles.link}>browsersupport.io</a>
      </Link>
    </header>
  )
}

Heading.displayName = 'Heading'

export default Heading
