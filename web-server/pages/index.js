import { Component } from 'react'
import 'isomorphic-unfetch'

import Page from '../components/Page'
import PropertyLink from '../components/PropertyLink'
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
    const { url, properties } = this.props
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
            <ul>
              {properties.map(property => (
                <li key={property._id}>
                  <PropertyLink name={property.name} prefetch>
                    <a>{property.name}</a>
                  </PropertyLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Page>
    )
  }
}

export default IndexPage
