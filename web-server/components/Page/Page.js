import Head from 'next/head'

import Footer from '../Footer'

import styles from './Page.css'

const Page = props => {
  const { title, children } = props

  return (
    <div className={styles.Page}>
      <Head>
        <title>
          {title ? `${title} – browsersupport.io` : 'browsersupport.io'}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"
        />
      </Head>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

Page.displayName = 'Page'

export default Page
