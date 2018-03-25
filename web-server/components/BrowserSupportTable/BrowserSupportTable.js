import { object, shape } from 'prop-types'
import cn from 'classnames'
import get from 'lodash/get'

import usage from '../../../alt-ww.json'
import browsers from './browsers'
import styles from './BrowserSupportTable.css'

const BrowserSupportTable = props => {
  const { property } = props
  const showAll = false

  return (
    <div>
      {browsers.map(browser => (
        <div key={browser.id} className={styles.browser}>
          <h2 className={styles.browserName}>{browser.name}</h2>
          <ol className={styles.versions}>
            {Object.keys(usage.data[browser.id])
              .sort((a, b) => parseFloat(b) - parseFloat(a))
              .map(version => {
                const support = get(
                  property,
                  `browsers.${browser.id}.${version.replace('.', '_')}`
                )
                const height = showAll
                  ? 20
                  : 10 * usage.data[browser.id][version]
                const fontSize = height <= 20 ? 10 : null
                const lineHeight = `${height}px`

                const className = cn(styles.version, {
                  [styles.hidden]: height < 10,
                  [styles.supported]: support && support.in,
                  [styles.unsupported]: support && !support.in,
                })

                return (
                  <li
                    key={version}
                    className={className}
                    style={{ height, fontSize, lineHeight }}
                  >
                    {version === '0' ? 'current' : version}
                  </li>
                )
              })}
          </ol>
        </div>
      ))}
    </div>
  )
}

BrowserSupportTable.displayName = 'BrowserSupportTable'

BrowserSupportTable.propTypes = {
  property: shape({
    browsers: object,
  }).isRequired,
}

export default BrowserSupportTable
