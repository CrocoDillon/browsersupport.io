import { Component } from 'react'

import ErrorPage from '../components/ErrorPage'

class CustomError extends Component {
  static displayName = 'CustomError'

  static getInitialProps({ res, err }) {
    const status = res ? res.statusCode : err ? err.statusCode : 500
    return { status }
  }

  render() {
    const { status } = this.props

    return <ErrorPage status={status} />
  }
}

export default CustomError
