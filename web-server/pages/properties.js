import { Component } from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'

class PropertiesPage extends Component {
  static displayName = 'PropertiesPage'

  static async getInitialProps({ asPath }) {
    // TODO: Remove querystring from asPath and do some basic validation
    const response = await fetch(
      `http://localhost:3000/api/properties${asPath}`
    )
    return response.json()
  }

  render() {
    const { property, suggestions } = this.props

    if (property) {
      return (
        <div>
          <h1>{property.name}</h1>
          <p>Browser support tables coming soon!</p>
        </div>
      )
    }

    return (
      <div>
        <h1>Not found :-(</h1>
        {suggestions.length > 0 ? (
          <div>
            <p>But we may have some suggestions for you</p>
            <ul>
              {suggestions.map(suggestion => (
                <li key={suggestion._id}>
                  <Link href="/properties" as={`/${suggestion.name}`} prefetch>
                    <a>{suggestion.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }
}

export default PropertiesPage
