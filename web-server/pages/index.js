import { Component } from 'react'
import getConfig from 'next/config'
import Head from 'next/head'
import 'isomorphic-unfetch'

import Heading from '../components/Heading'
import Overview from '../components/Overview'
import Page from '../components/Page'
import PropertyList from '../components/PropertyList'

const { publicRuntimeConfig } = getConfig()

class IndexPage extends Component {
  static displayName = 'IndexPage'

  static async getInitialProps({ query, req }) {
    const { q, page } = query
    const protocol = publicRuntimeConfig.https ? 'https' : 'http'
    const host = req ? req.headers.host : location.host

    if (q) {
      let qs = `q=${encodeURIComponent(q)}`

      if (page) {
        qs += `&page=${encodeURIComponent(page)}`
      }

      const response = await fetch(`${protocol}://${host}/api/properties?${qs}`)
      return response.json()
    }

    return {}
  }

  render() {
    const { url, properties, page, perPage, totalCount } = this.props
    const { q } = url.query

    if (q) {
      return (
        <Page>
          <Head>
            <meta name="robots" content="noindex, follow" />
          </Head>
          <Heading>Search</Heading>
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
        </Page>
      )
    }

    return (
      <Page>
        <Heading index />
        <Overview />
      </Page>
    )
  }
}

export default IndexPage
