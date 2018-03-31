import { Component } from 'react'
import 'isomorphic-unfetch'

import BrowserSupportTable from '../components/BrowserSupportTable'
import Heading from '../components/Heading'
import Page from '../components/Page'
import Suggestions from '../components/Suggestions'

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
          <Heading>Not Found</Heading>
          {suggestions && suggestions.length > 0 ? (
            <Suggestions suggestions={suggestions} />
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 200px)',
                textAlign: 'center',
                fontSize: '64px',
              }}
            >
              404
            </div>
          )}
        </Page>
      )
    }

    return (
      <Page title={property.name}>
        <Heading property={property} />
        <BrowserSupportTable property={property} />
      </Page>
    )
  }
}

export default PropertiesPage
