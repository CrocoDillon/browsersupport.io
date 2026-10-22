'use client'
import { useRef, useState } from 'react'
import { browsers } from '@browsersupport/data'
import {
  detectProperty,
  discoverProperties,
} from '@browsersupport/data/detection'
async function jsonResponse(response: Response) {
  const json = await response.json()
  if (!response.ok) throw new Error(json.error || 'The lab request failed')
  return json
}
export function Acquisition() {
  const [names, setNames] = useState<string[]>([])
  const [browser, setBrowser] = useState('chrome')
  const [version, setVersion] = useState('')
  const [message, setMessage] = useState('Ready when you are.')
  const [busy, setBusy] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const stopped = useRef(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const scan = () => {
    const environment = frame.current?.contentWindow
    if (!environment)
      return setMessage('The clean browser context is still loading.')
    const collected = discoverProperties(environment)
    setNames(collected)
    setMessage(
      'Found ' +
        collected.length +
        ' properties. Review the names, then save them to the archive.'
    )
  }
  const save = async () => {
    setBusy(true)
    try {
      const result = await jsonResponse(
        await fetch('/api/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ names }),
        })
      )
      setMessage(
        'Added ' +
          result.inserted +
          ' new properties. Existing observations were kept.'
      )
      setNames([])
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Could not save properties'
      )
    } finally {
      setBusy(false)
    }
  }
  const detect = async () => {
    setBusy(true)
    setDetecting(true)
    stopped.current = false
    let total = 0
    try {
      while (!stopped.current) {
        const batch = await jsonResponse(
          await fetch(
            '/api/observations?browser=' +
              encodeURIComponent(browser) +
              '&version=' +
              encodeURIComponent(version),
            { cache: 'no-store' }
          )
        )
        if (!batch.names.length) {
          setMessage(
            'Finished. Saved ' +
              total +
              ' new observations for ' +
              browser +
              ' ' +
              version +
              '.'
          )
          return
        }
        const results = batch.names.map((name: string) => ({
          name,
          ...detectProperty(
            name,
            frame.current!.contentWindow! as unknown as Record<string, unknown>
          ),
        }))
        const saved = await jsonResponse(
          await fetch('/api/observations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ browser, version, properties: results }),
          })
        )
        total += saved.updated
        setMessage(
          'Saved ' +
            total +
            ' observations for ' +
            browser +
            ' ' +
            version +
            '…'
        )
      }
      setMessage(
        'Stopped after ' +
          total +
          ' observations. You can resume the same browser version later.'
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Detection failed')
    } finally {
      setBusy(false)
      setDetecting(false)
    }
  }
  return (
    <>
      <iframe
        title="Clean browser context"
        src="about:blank"
        ref={frame}
        hidden
      />
      <div className="lab-grid">
        <section className="lab-panel">
          <span className="eyebrow">01 / DISCOVER</span>
          <h2>Meet this browser’s APIs.</h2>
          <p>
            Inspect globals, static properties, prototypes, and well-known
            symbols. The scan avoids invoking global getters.
          </p>
          <button className="lab-action" onClick={scan} disabled={busy}>
            Discover properties
          </button>
          {names.length > 0 && (
            <>
              <pre className="lab-preview">
                {names.slice(0, 60).join('\n')}
                {names.length > 60 ? '\n…' : ''}
              </pre>
              <button className="lab-action" onClick={save} disabled={busy}>
                Save {names.length.toLocaleString('en')} names
              </button>
            </>
          )}
        </section>
        <section className="lab-panel">
          <span className="eyebrow">02 / DETECT</span>
          <h2>See what’s really there.</h2>
          <p>
            Check untested properties in batches of 500. Existing results for
            this browser version stay as they are.
          </p>
          <div className="lab-fields">
            <label>
              Browser family
              <select
                value={browser}
                onChange={e => setBrowser(e.target.value)}
                disabled={busy}
              >
                {browsers.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Browser version
              <input
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="e.g. 156.0"
                inputMode="decimal"
                maxLength={19}
                disabled={busy}
              />
            </label>
          </div>
          <button
            className="lab-action"
            disabled={busy || !version}
            onClick={detect}
          >
            Detect in this browser
          </button>
          {detecting && (
            <button
              className="pill lab-secondary"
              onClick={() => {
                stopped.current = true
              }}
            >
              Stop after this batch
            </button>
          )}
        </section>
      </div>
      <div className="lab-status" role="status" aria-live="polite">
        {message}
      </div>
    </>
  )
}
