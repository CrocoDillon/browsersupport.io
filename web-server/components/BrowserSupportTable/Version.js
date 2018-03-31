import { Component } from 'react'
import { bool, number, object, string } from 'prop-types'
import { Overlay } from 'react-overlays'
import cn from 'classnames'

import Tooltip from '../Tooltip'

import styles from './Version.css'

class Version extends Component {
  static displayName = 'Version'

  static propTypes = {
    browser: string.isRequired,
    version: string.isRequired,
    support: object,
    usage: number,
    dynamic: bool.isRequired,
  }

  state = {
    hovered: false,
  }

  onMouseOver = () => {
    this.setState({ hovered: true })
  }

  onMouseOut = () => {
    this.setState({ hovered: false })
  }

  onHide = () => {
    this.setState({ hovered: false })
  }

  render() {
    const { browser, version, support, usage, dynamic } = this.props
    const { hovered } = this.state

    const height = dynamic ? 10 * usage : 20
    const lineHeight = `${height}px`

    const className = cn(styles.Version, {
      [styles.supported]: support && support.in,
      [styles.notSupported]: support && !support.in,
      [styles.smallText]: 10 <= height && height < 20,
      [styles.hideText]: height < 10,
    })

    return (
      <li
        className={className}
        style={{ height, lineHeight }}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        {version !== '0' ? version : 'all'}
        <Overlay
          target={this}
          show={hovered}
          onHide={this.onHide}
          placement="bottom"
          containerPadding={8}
          rootClose
        >
          <Tooltip
            background={support ? (support.in ? 'green' : 'red') : 'yellow'}
          >
            <div className={styles.tooltipBrowser}>
              {browser}
              {version !== '0' ? ` ${version}` : null}
            </div>
            <div className={styles.tooltipSupport}>
              {support
                ? support.in ? 'Supported' : 'Not supported'
                : 'Support unknown'}
            </div>
          </Tooltip>
        </Overlay>
      </li>
    )
  }
}

export default Version
