import { string } from 'prop-types'
import Head from 'next/head'
import Router from 'next/router'

import * as gtag from '../../utils/gtag'

import Footer from './Footer'

import './normalize.css'
import styles from './Page.css'

Router.onRouteChangeComplete = url => {
  gtag.pageview(url)
}

const defaultDescription =
  'Find browser compatibility tables for all ECMAScript and JavaScript APIs on browsersupport.io'

const Page = props => {
  const { title, description, children } = props

  return (
    <div className={styles.Page}>
      <Head>
        <title>{title ? title : 'browsersupport.io'}</title>
        <meta
          name="description"
          content={
            description
              ? `${description}. ${defaultDescription}`
              : defaultDescription
          }
        />
      </Head>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

Page.displayName = 'Page'

Page.propTypes = {
  title: string,
  description: string,
}

export default Page
