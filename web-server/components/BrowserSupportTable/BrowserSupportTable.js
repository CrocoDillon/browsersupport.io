import { Component } from 'react'
import { object, shape, string } from 'prop-types'
import get from 'lodash/get'

import usage from '../../../alt-ww.json'

import Browser from './Browser'

import styles from './BrowserSupportTable.css'

const browsers = [
  {
    id: 'chrome',
    name: 'Chrome',
  },
  {
    id: 'edge',
    name: 'Edge',
  },
  {
    id: 'firefox',
    name: 'Firefox',
  },
  {
    id: 'ie',
    name: 'IE',
  },
  {
    id: 'opera',
    name: 'Opera',
  },
  {
    id: 'safari',
    name: 'Safari',
  },
  {
    id: 'and_chr',
    name: 'Chrome for Android',
  },
  {
    id: 'and_ff',
    name: 'Firefox for Android',
  },
  {
    id: 'and_uc',
    name: 'UC for Android',
  },
  {
    id: 'ie_mob',
    name: 'IE Mobile',
  },
  {
    id: 'ios_saf',
    name: 'iOS Safari',
  },
  {
    id: 'op_mini',
    name: 'Opera Mini',
  },
]

class BrowserSupportTable extends Component {
  static displayName = 'BrowserSupportTable'

  static propTypes = {
    property: shape({
      _id: string.isRequired,
      name: string.isRequired,
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
          const browserSupport = get(property, `browsers.${id}`, {})
          const browserUsage = usage.data[id]

          return (
            <div key={id} className={styles.browser}>
              <Browser
                name={name}
                support={browserSupport}
                usage={browserUsage}
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
