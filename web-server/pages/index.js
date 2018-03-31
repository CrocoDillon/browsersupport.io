import { Component } from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'

import Page from '../components/Page'
import SearchForm from '../components/SearchForm'

class IndexPage extends Component {
  static displayName = 'IndexPage'

  static async getInitialProps({ query }) {
    const { q, page } = query

    if (q) {
      let qs = `q=${encodeURIComponent(q)}`

      if (page) {
        qs += `&page=${encodeURIComponent(page)}`
      }

      const response = await fetch(`http://localhost:3000/api/properties?${qs}`)
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
                  <Link
                    href={`/property?name=${encodeURIComponent(property.name)}`}
                    as={`/${property.name}`}
                    prefetch
                  >
                    <a>{property.name}</a>
                  </Link>
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
