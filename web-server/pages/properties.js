import { Component } from 'react'
import Link from 'next/link'
import 'isomorphic-unfetch'

import BrowserSupportTable from '../components/BrowserSupportTable'
import Heading from '../components/Heading'
import Page from '../components/Page'

const parentRe = /^(.+?)((?:\.|\[@@).+)$/

class PropertiesPage extends Component {
  static displayName = 'PropertiesPage'

  static async getInitialProps({ asPath, res }) {
    // TODO: Remove querystring from asPath and do some basic validation
    const response = await fetch(
      `http://localhost:3000/api/properties${asPath}`
    )
    const json = await response.json()
    const { property, suggestions } = json

    if (res && property === null) {
      if (suggestions.length === 1) {
        // Only one suggestion so might as well redirect
        res.writeHead(302, {
          Location: `http://localhost:3000/${suggestions[0].name}`,
        })
        res.end()
        res.finished = true
      }

      res.statusCode = 404
    }

    return json
  }

  render() {
    const { property, suggestions } = this.props

    if (property === null) {
      return (
        <Page>
          <h1>Not found :-(</h1>
          {suggestions.length > 0 ? (
            <div>
              <p>But we may have some suggestions for you</p>
              <ul>
                {suggestions.map(suggestion => (
                  <li key={suggestion._id}>
                    <Link
                      href="/properties"
                      as={`/${suggestion.name}`}
                      prefetch
                    >
                      <a>{suggestion.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Page>
      )
    }

    const parentMatch = property.name.match(parentRe)

    return (
      <Page title={property.name}>
        {parentMatch ? (
          <Heading>
            <Link href={parentMatch[1]}>
              <a>{parentMatch[1]}</a>
            </Link>
            {parentMatch[2]}
          </Heading>
        ) : (
          <Heading>{property.name}</Heading>
        )}
        <BrowserSupportTable property={property} />
      </Page>
    )
  }
}

export default PropertiesPage
