import Head from 'next/head'

import Footer from './Footer'

import styles from './Page.css'

const Page = props => {
  const { title, children } = props

  return (
    <div className={styles.Page}>
      <Head>
        <title>
          {title ? `${title} – browsersupport.io` : 'browsersupport.io'}
        </title>
      </Head>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

Page.displayName = 'Page'

export default Page
