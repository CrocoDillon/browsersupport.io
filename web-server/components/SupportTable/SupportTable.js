import { object, shape } from 'prop-types'
import cn from 'classnames'
import get from 'lodash/get'

import usage from '../../../alt-ww.json'
import styles from './SupportTable.css'

const SupportTable = props => {
  const { browsers } = props.property

  return (
    <div className={styles.SupportTable}>
      {['ie', 'edge', 'firefox', 'chrome', 'safari', 'opera'].map(browser => (
        <div key={browser} className={styles.browser}>
          <h2>{browser}</h2>
          <ol className={styles.versions}>
            {Object.keys(usage.data[browser])
              .sort((a, b) => parseFloat(a) - parseFloat(b))
              .map(version => {
                const support = get(browsers, `${browser}.${version}`, {})
                const height = 10 * usage.data[browser][version]

                const className = cn(styles.version, {
                  [styles.supported]: support.in === true,
                  [styles.unsupported]: support.in === false,
                })

                return (
                  <li key={version} className={className} style={{ height }}>
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
