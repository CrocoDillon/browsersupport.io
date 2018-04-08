import { Component, Fragment } from 'react'
import Head from 'next/head'
import 'isomorphic-unfetch'

import Header from '../components/Header'
import Overview from '../components/Overview'
import Page from '../components/Page'
import PropertyList from '../components/PropertyList'

class IndexPage extends Component {
  static displayName = 'IndexPage'

  static async getInitialProps({ query, req }) {
    const { q, page } = query
    const host = req ? req.headers.host : location.host

    if (q) {
      let qs = `q=${encodeURIComponent(q)}`

      if (page) {
        qs += `&page=${encodeURIComponent(page)}`
      }

      const response = await fetch(`http://${host}/api/properties?${qs}`)
      return response.json()
    }

    return {}
  }

  render() {
    const { url, properties, page, perPage, totalCount } = this.props
    const { q } = url.query

    return (
      <Page>
        {q ? (
          <Head>
            <meta name="robots" content="noindex, follow" />
          </Head>
        ) : null}
        <Header />
        {q ? (
          <Fragment>
            <p>
              {totalCount === 1 ? '1 result' : `${totalCount} results`} for “<b>
                {q}
              </b>”
            </p>
            <PropertyList
              properties={properties}
              page={page}
              perPage={perPage}
              totalCount={totalCount}
              url={url}
            />
          </Fragment>
        ) : (
          <Overview />
        )}
      </Page>
    )
  }
}

export default IndexPage
