import { bool, object, string } from 'prop-types'
import cn from 'classnames'
import get from 'lodash/get'

import styles from './BrowserSupport.css'

const BrowserSupport = props => {
  const { name, support, usage, dynamic } = props

  return (
    <div className={styles.BrowserSupport}>
      <h2 className={styles.name}>{name}</h2>
      <ol className={styles.versions}>
        {Object.keys(usage)
          .sort((a, b) => parseFloat(b) - parseFloat(a))
          .map(version => {
            const versionSupport = get(support, version.replace('.', '_'))
            const height = dynamic ? 10 * usage[version] : 20
            const fontSize = height <= 20 ? 10 : null
            const lineHeight = `${height}px`

            const className = cn(styles.version, {
              [styles.hidden]: height < 10,
              [styles.supported]: versionSupport && versionSupport.in,
              [styles.unsupported]: versionSupport && !versionSupport.in,
            })

            return (
              <li
                key={version}
                className={className}
                style={{ height, fontSize, lineHeight }}
              >
                {version === '0' ? 'all' : version}
              </li>
            )
          })}
      </ol>
    </div>
  )
}

BrowserSupport.displayName = 'BrowserSupport'

BrowserSupport.propTypes = {
  name: string.isRequired,
  support: object.isRequired,
  usage: object.isRequired,
  dynamic: bool.isRequired,
}

export default BrowserSupport
