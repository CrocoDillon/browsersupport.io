import { object, shape } from 'prop-types'
import cn from 'classnames'
import get from 'lodash/get'

import usage from '../../../alt-ww.json'
import styles from './SupportTable.css'

const SupportTable = props => {
  const { browsers } = props.property
  const showAll = false

  return (
    <div className={styles.SupportTable}>
      {['ie', 'edge', 'firefox', 'chrome', 'safari', 'opera'].map(browser => (
        <div key={browser} className={styles.browser}>
          <h2 className={styles.browserName}>{browser}</h2>
          <ol className={styles.versions}>
            {Object.keys(usage.data[browser])
              .sort((a, b) => parseFloat(a) - parseFloat(b))
              .map(version => {
                const support = get(browsers, `${browser}.${version}`)
                const height = showAll ? 20 : 10 * usage.data[browser][version]
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
                    {version}
                  </li>
                )
              })}
          </ol>
        </div>
      ))}
    </div>
  )
}

SupportTable.displayName = 'SupportTable'

SupportTable.propTypes = {
  property: shape({
    browsers: object,
  }).isRequired,
}

export default SupportTable
