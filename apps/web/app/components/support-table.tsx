'use client'
import { useState } from 'react'
import {
  browsers,
  compareVersions,
  displayVersion,
  supportOf,
  type Property,
  type Observation,
} from '@browsersupport/data'
const mainBrowsers = [
  'chrome',
  'edge',
  'firefox',
  'safari',
  'and_chr',
  'ios_saf',
]
const labels = { present: 'Present', absent: 'Absent', unknown: 'Unknown' }
const symbols = { present: '✓', absent: '−', unknown: '?' }
function Cell({
  version,
  observation,
}: {
  version: string
  observation?: Observation
}) {
  const status = supportOf(observation)
  const detail = observation?.throws
    ? 'Detection threw an error'
    : observation?.own === false && status === 'present'
      ? 'Inherited property'
      : 'Property existence check'
  return (
    <li
      className={'version-cell ' + status}
      title={
        detail +
        (observation?.recordedAt
          ? ' · ' + observation.recordedAt
          : ' · Test date not recorded')
      }
    >
      <span className="mono">{displayVersion(version)}</span>
      <span className="cell-state">
        <span aria-hidden="true">{symbols[status]}</span>
        <span className="sr-only">{labels[status]}</span>
      </span>
    </li>
  )
}
export function SupportTable({ property }: { property: Property }) {
  const [allVersions, setAllVersions] = useState(false)
  const [allBrowsers, setAllBrowsers] = useState(false)
  const keys = Object.keys(property.browsers)
  const known: [string, string][] = browsers.map(([id, name]) => [id, name])
  keys
    .filter(id => !known.some(([key]) => key === id))
    .forEach(id => known.push([id, id]))
  const visible = allBrowsers
    ? known.filter(([id]) => keys.includes(id) || mainBrowsers.includes(id))
    : known.filter(([id]) => mainBrowsers.includes(id))
  const hasDated = Object.values(property.browsers).some(versions =>
    Object.values(versions).some(o => o.recordedAt)
  )
  return (
    <section aria-labelledby="support-heading" className="support-section">
      <div className="section-bar">
        <div>
          <span className="eyebrow">THE OBSERVATIONS</span>
          <h2 id="support-heading">Browser support</h2>
        </div>
        <div className="table-controls">
          <button
            className="pill"
            aria-pressed={allBrowsers}
            onClick={() => setAllBrowsers(!allBrowsers)}
          >
            {allBrowsers ? 'Main browsers' : 'More browsers'}
          </button>
          <button
            className="pill"
            aria-pressed={allVersions}
            onClick={() => setAllVersions(!allVersions)}
          >
            {allVersions ? 'Recent versions' : 'All versions'}
          </button>
        </div>
      </div>
      <p className="muted table-intro">
        {hasDated
          ? 'Recorded property checks. Open a cell’s tooltip for its test date.'
          : 'Legacy observations · test dates were not recorded.'}{' '}
        Versions shown are those tested, not the latest browser releases.
      </p>
      <div
        className="support-scroll"
        tabIndex={0}
        role="region"
        aria-label="Browser observations, scroll horizontally"
      >
        <div
          className="support-grid"
          style={{
            gridTemplateColumns:
              'repeat(' + visible.length + ', minmax(140px, 1fr))',
          }}
        >
          {visible.map(([id, name]) => {
            const versions = Object.keys(property.browsers[id] ?? {}).sort(
              (a, b) => compareVersions(b, a)
            )
            const shown = allVersions ? versions : versions.slice(0, 8)
            return (
              <div className="browser-column" key={id}>
                <div className="browser-title">
                  <span
                    className={'browser-symbol browser-' + id}
                    aria-hidden="true"
                  >
                    {name.charAt(0)}
                  </span>
                  <h3>{name}</h3>
                </div>
                <span className="browser-subtitle">
                  {versions.length
                    ? versions.length +
                      (versions.length === 1
                        ? ' version tested'
                        : ' versions tested')
                    : 'Not tested'}
                </span>
                {versions.length ? (
                  <ol className="versions">
                    {shown.map(version => (
                      <Cell
                        key={version}
                        version={version}
                        observation={property.browsers[id][version]}
                      />
                    ))}
                  </ol>
                ) : (
                  <p className="no-observations">
                    ?<span>No observations</span>
                  </p>
                )}
                {!allVersions && versions.length > 8 && (
                  <span className="older-count">
                    + {versions.length - 8} older
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="legend">
        <span>
          <i className="legend-dot present" />
          Present
        </span>
        <span>
          <i className="legend-dot absent" />
          Absent
        </span>
        <span>
          <i className="legend-dot unknown" />
          Unknown
        </span>
        <span className="legend-note">
          Presence ≠ a correct implementation.
        </span>
      </div>
    </section>
  )
}
