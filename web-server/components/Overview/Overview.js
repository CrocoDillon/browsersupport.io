import styles from './Overview.css'

const Overview = () => (
  <div className={styles.Overview}>
    <p className={styles.callout}>
      Find browser compatibility tables for all ECMAScript and JavaScript APIs
    </p>
    <div className={styles.features}>
      <div className={styles.feature}>extensive database</div>
      <div className={styles.feature}>about 45.000 properties</div>
      <div className={styles.feature}>currently in beta</div>
    </div>
    <a
      className={styles.github}
      href="https://github.com/CrocoDillon/browsersupport.io/issues"
    >
      bug reports and feature requests on GitHub
    </a>
  </div>
)

Overview.displayName = 'Overview'

export default Overview
