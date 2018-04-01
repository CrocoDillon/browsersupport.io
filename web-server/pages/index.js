import { Component } from 'react'
import 'isomorphic-unfetch'

import Page from '../components/Page'
import PropertyList from '../components/PropertyList'
import SearchForm from '../components/SearchForm'

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
        <h1>browsersupport.io</h1>
        <SearchForm defaultValue={q} />
        {q ? (
          <div>
            <p>
              Results for "<b>{q}</b>"
            </p>
            <PropertyList
              properties={properties}
              page={page}
              perPage={perPage}
              totalCount={totalCount}
              url={url}
            />
          </div>
        ) : null}
      </Page>
    )
  }
}

export default IndexPage
