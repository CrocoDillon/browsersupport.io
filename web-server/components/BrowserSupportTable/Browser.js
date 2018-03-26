import { bool, object, string } from 'prop-types'
import get from 'lodash/get'

import Version from './Version'

import styles from './Browser.css'

const Browser = props => {
  const { name, support, usage, dynamic } = props

  // Versions sorted from newest to oldest
  const versions = Object.keys(usage).sort(
    (a, b) => parseFloat(b) - parseFloat(a)
  )

  return (
    <div className={styles.Browser}>
      <h2 className={styles.name}>{name}</h2>
      <ol className={styles.versions}>
        {versions.map(version => {
          const versionSupport = get(support, version.replace('.', '_')) // TODO: Get rid of the _
          const versionUsage = usage[version]

          return (
            <Version
              key={version}
              browser={name}
              version={version}
              support={versionSupport}
              usage={versionUsage}
              dynamic={dynamic}
            />
          )
        })}
      </ol>
    </div>
  )
}

Browser.displayName = 'Browser'

Browser.propTypes = {
  name: string.isRequired,
  support: object.isRequired,
  usage: object.isRequired,
  dynamic: bool.isRequired,
}

export default Browser
