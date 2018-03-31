import { Component, Fragment } from 'react'
import 'isomorphic-unfetch'

import Breadcrumbs from '../components/Breadcrumbs'
import BrowserSupportTable from '../components/BrowserSupportTable'
import ErrorPage from '../components/ErrorPage'
import Heading from '../components/Heading'
import Page from '../components/Page'

const sort = (a, b) => {
  if (a.name > b.name) {
    return 1
  }

  if (a.name < b.name) {
    return -1
  }

  return 0
}

class PropertyPage extends Component {
  static displayName = 'PropertyPage'

  static async getInitialProps({ query, res }) {
    const response = await fetch(
      `http://localhost:3000/api/properties/${query.name}`
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
      if (suggestions && suggestions.length > 0) {
        return (
          <Page>
            <Heading>Are you looking for...</Heading>
            {suggestions.sort(sort).map(suggestion => (
              <Fragment key={suggestion._id}>
                <h2>
                  <Breadcrumbs name={suggestion.name} />
                </h2>
                <BrowserSupportTable property={suggestion} />
              </Fragment>
            ))}
          </Page>
        )
      }

      return <ErrorPage status={404} />
    }

    return (
      <Page title={property.name}>
        <Heading property={property} />
        <BrowserSupportTable property={property} />
      </Page>
    )
  }
}

export default PropertyPage
