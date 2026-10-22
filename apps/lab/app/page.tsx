import { catalogStats } from '@browsersupport/data/database'
import { Acquisition } from './acquisition'
export const dynamic = 'force-dynamic'
export default async function Lab() {
  const { count } = await catalogStats()
  return (
    <section className="lab-page">
      <span className="eyebrow">THE LOCAL DEVICE LAB</span>
      <h1>A browser. A few questions.</h1>
      <p className="lede">
        Collect the properties this browser exposes, then check the archive
        against it. Results go straight to MongoDB. No account, no public
        endpoint.
      </p>
      <p className="lab-summary">
        {count.toLocaleString('en')} properties in the connected database
      </p>
      <Acquisition />
      <p className="lab-note">
        Checks run in a fresh same-origin iframe to keep application globals out
        of the archive. API exposure can differ from a top-level page. Use a
        clean browser profile without extensions or injected polyfills. Choose
        the browser family and version carefully: labels are supplied by you,
        not inferred from the user agent. This lab uses modern JavaScript;
        testing older browsers or remote devices needs a separate harness. Sauce
        Labs isn’t connected.
      </p>
    </section>
  )
}
