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
    const fontSize = 10 < height && height <= 20 ? 10 : null
    const lineHeight = 10 < height ? `${height}px` : null

    const className = cn(styles.Version, {
      [styles.hidden]: height < 10,
      [styles.supported]: support && support.in,
      [styles.notSupported]: support && !support.in,
    })

    return (
      <li
        className={className}
        style={{ height, fontSize, lineHeight }}
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
          <Tooltip background={support ? (support.in ? 'green' : 'red') : null}>
            {browser}
            {version !== '0' ? ` ${version}` : null}{' '}
            {support
              ? support.in ? 'supports this' : 'does not support this'
              : 'has unknown support'}
          </Tooltip>
        </Overlay>
      </li>
    )
  }
}

export default Version
