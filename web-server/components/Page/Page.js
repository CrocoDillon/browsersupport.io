import Head from 'next/head'

import Header from '../Header'
import Footer from '../Footer'

import './Page.css'

const Page = props => {
  const { title, children } = props

  return (
    <div className="Page">
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
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  )
}

Page.displayName = 'Page'

export default Page
