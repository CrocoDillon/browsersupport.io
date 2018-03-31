/* eslint-disable react/display-name */
import { Component } from 'react'

import ErrorPage from '../components/ErrorPage'

export default class Error extends Component {
  static getInitialProps({ res, err }) {
    const status = res ? res.statusCode : err ? err.statusCode : 500
    return { status }
  }

  render() {
    const { status } = this.props

    return <ErrorPage status={status} />
  }
}
