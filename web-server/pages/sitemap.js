import { Component } from 'react'
import getConfig from 'next/config'
import Head from 'next/head'
import 'isomorphic-unfetch'

import Heading from '../components/Heading'
import Page from '../components/Page'
import PropertyList from '../components/PropertyList'

const { publicRuntimeConfig } = getConfig()

class SitemapPage extends Component {
  static displayName = 'SitemapPage'

  static async getInitialProps({ query, req }) {
    const { page = 1 } = query
    const protocol = publicRuntimeConfig.https ? 'https' : 'http'
    const host = req ? req.headers.host : location.host

    const response = await fetch(
      `${protocol}://${host}/api/properties?page=${encodeURIComponent(page)}`
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
        <Heading>Sitemap (not for humans)</Heading>
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
