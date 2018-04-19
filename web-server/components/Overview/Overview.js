import Breadcrumbs from '../Breadcrumbs'
import Icon from '../Icon'

import styles from './Overview.css'

const examples = ['NaN', 'Object.entries', 'String.prototype.trimStart']

const Overview = () => (
  <div>
    <p className={styles.callout}>
      Find browser compatibility tables for all ECMAScript and JavaScript APIs
    </p>
    <h2 id="about">About browsersupport.io</h2>
    <p>
      On browsersupport.io you can find browser compatibility tables for all
      ECMAScript and JavaScript APIs. This means we do not only have tables for
      popular, modern and well specified APIs but also for browser specific,
      vendor prefixed and deprecated APIs. Our database currently features about
      45.000 properties.
    </p>
    <p>
      The goal of browsersupport.io is to be the #1 resource on the internet to
      find browser compatibility tables for everything JavaScript related. The
      difference to caniuse.com (and similar websites) is that while
      browsersupport.io only features JavaScript related properties it does so
      very extensively. No properties are left out, not even the ones that
      “everyone” knows works in all browsers or the ones that “everyone” knows
      works in hardly any browsers at all.
    </p>
    <p>Some examples:</p>
    <ol className={styles.examples}>
      {examples.map(example => (
        <li key={example} className={styles.example}>
          <h3>
            <Breadcrumbs name={example} />
          </h3>
          <img src={`/static/${example}.png`} />
        </li>
      ))}
    </ol>
    <p>
      Keep in mind that this website is currently in beta and that property
      tests are shallow. That means that properties are reported as supported
      when they exist, even if their implementation is buggy. Reporting browser
      issues is on the roadmap.
    </p>
    <h2 id="help">How you can help</h2>
    <ul className={styles.list}>
      <li>
        <span className={styles.icon}>
          <Icon glyph="bug" />
        </span>{' '}
        Submit issues and missing properties on{' '}
        <a
          href="https://github.com/CrocoDillon/browsersupport.io/issues"
          target="_blank"
        >
          GitHub
        </a>
      </li>
      <li>
        <span className={styles.icon}>
          <Icon glyph="open-source" />
        </span>{' '}
        Got an idea for a nice feature? Talk about it on{' '}
        <a
          href="https://github.com/CrocoDillon/browsersupport.io/issues"
          target="_blank"
        >
          GitHub
        </a>
      </li>
      <li>
        <span className={styles.icon}>
          <Icon glyph="twitter" />
        </span>{' '}
        Spread the word!
      </li>
    </ul>
  </div>
)

Overview.displayName = 'Overview'

export default Overview
