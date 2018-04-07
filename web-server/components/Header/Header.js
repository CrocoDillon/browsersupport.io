import Link from 'next/link'

import SearchForm from '../SearchForm'

import styles from './Header.css'

const Header = () => (
  <header>
    <Link href="/">
      <a className={styles.link}>
        <h1>browsersupport.io</h1>
      </a>
    </Link>
    <div className={styles.search}>
      <SearchForm />
    </div>
  </header>
)

Header.displayName = 'Header'

export default Header
