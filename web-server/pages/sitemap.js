import { Component } from 'react'
import Head from 'next/head'
import 'isomorphic-unfetch'

import Heading from '../components/Heading'
import Page from '../components/Page'
import PropertyList from '../components/PropertyList'

class SitemapPage extends Component {
  static displayName = 'SitemapPage'

  static async getInitialProps({ query, req }) {
    const { page = 1 } = query
    const host = req ? req.headers.host : location.host

    const response = await fetch(
      `http://${host}/api/properties?page=${encodeURIComponent(page)}`
    )
    return response.json()
  }

  render() {
    const { url, properties, page, perPage, totalCount } = this.props

    return (
      <Page>
        <Head>
          <meta name="robots" content="noindex, follow" />
        </Head>
        <Heading>sitemap (not for humans)</Heading>
        <PropertyList
          properties={properties}
          page={page}
          perPage={perPage}
          totalCount={totalCount}
          url={url}
        />
      </Page>
    )
  }
}

export default SitemapPage
