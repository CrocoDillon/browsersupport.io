import { Component } from 'react'
import { object, shape } from 'prop-types'
import get from 'lodash/get'

import { data } from '../../../alt-ww.json'

import browsers from './browsers'
import BrowserSupport from './BrowserSupport'

import styles from './BrowserSupportTable.css'

class BrowserSupportTable extends Component {
  static displayName = 'BrowserSupportTable'

  static propTypes = {
    property: shape({
      browsers: object,
    }).isRequired,
  }

  state = {
    dynamic: true,
  }

  onClick = () => {
    this.setState({ dynamic: !this.state.dynamic })
  }

  render() {
    const { property } = this.props
    const { dynamic } = this.state

    return (
      <div onClick={this.onClick}>
        {browsers.map(({ id, name }) => {
          const support = get(property, `browsers.${id}`, {})
          const usage = data[id]

          return (
            <div key={id} className={styles.browser}>
              <BrowserSupport
                name={name}
                support={support}
                usage={usage}
                dynamic={dynamic}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

export default BrowserSupportTable
