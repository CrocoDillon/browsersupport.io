import Link from 'next/link'

import SauceLabsLogo from './SauceLabsLogo'

import styles from './Footer.css'

const Footer = () => (
  <footer className={styles.Footer}>
    <div className={styles.ownLinks}>
      made by <a href="https://twitter.com/CrocoDillon">@CrocoDillon</a>
      {' | '}
      source on{' '}
      <a href="https://github.com/CrocoDillon/browsersupport.io">GitHub</a>
      <Link href="/sitemap">
        <a hidden>.</a>
      </Link>
    </div>
    <div className={styles.sauceLabs}>
      powered by
      <a href="https://saucelabs.com/">
        <SauceLabsLogo />
      </a>
    </div>
  </footer>
)

Footer.displayName = 'Footer'

export default Footer
