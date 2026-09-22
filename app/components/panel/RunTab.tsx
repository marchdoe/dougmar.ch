import { useState } from 'react'
import { Checkbox } from '@base-ui/react/checkbox'
import { css, cx } from '../../../styled-system/css'
import {
  sectionTitle,
  runBox,
  statusDot,
  mutedText,
  runStatusLine,
  subtleLink,
  checkboxRow,
  checkboxBox,
  checkboxIndicator,
  button,
  errorText,
  successText,
} from './styles'
import { triggerRun, type RunInfo } from './api'

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M1.5 5.2 3.8 7.5 8.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function runTone(run: RunInfo): 'success' | 'failure' | 'pending' {
  if (!run.conclusion) return 'pending'
  return run.conclusion === 'success' ? 'success' : 'failure'
}

export function RunTab({
  latestRun,
  onTriggered,
}: {
  latestRun: RunInfo | null
  onTriggered: () => void
}) {
  const [dryRun, setDryRun] = useState(false)
  // A union with `| string` collapses to string, so the three literals
  // checked nothing and the error text shared a channel with the state.
  // RateTab in this same folder already had the right shape.
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'busy' }
    | { kind: 'dispatched' }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' })

  const trigger = async () => {
    setState({ kind: 'busy' })
    try {
      await triggerRun(dryRun)
      setState({ kind: 'dispatched' })
      onTriggered()
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  return (
    <section>
      <h2 className={sectionTitle}>Latest run</h2>
      {latestRun ? (
        <div className={runBox}>
          <div className={runStatusLine}>
            <span className={statusDot({ tone: runTone(latestRun) })} />
            {latestRun.status}
            {latestRun.conclusion ? ` — ${latestRun.conclusion}` : ''}
          </div>
          <p className={cx(mutedText, css({ marginTop: '3px' }))}>
            {new Date(latestRun.createdAt).toLocaleString()} ·{' '}
            <a className={subtleLink} href={latestRun.url}>
              view on GitHub ↗
            </a>
          </p>
        </div>
      ) : (
        <p className={cx(mutedText, css({ marginBottom: '14px' }))}>No runs found.</p>
      )}
      {/* biome-ignore lint/a11y/noLabelWithoutControl: Checkbox.Root renders a hidden native <input> inside this label, which associates it; Biome can't see through the component. */}
      <label className={checkboxRow}>
        <Checkbox.Root className={checkboxBox} checked={dryRun} onCheckedChange={setDryRun}>
          <Checkbox.Indicator className={checkboxIndicator}>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Dry run (build + verify, no commit)
      </label>
      <button
        type="button"
        disabled={state.kind === 'busy'}
        onClick={trigger}
        className={button({ kind: 'primary' })}
      >
        {state.kind === 'busy' ? 'Dispatching…' : 'Trigger build'}
      </button>
      {state.kind === 'dispatched' && (
        <p className={cx(successText, css({ marginTop: '10px' }))}>
          Dispatched — refresh status in a minute.
        </p>
      )}
      {state.kind === 'error' && (
        <p role="alert" className={cx(errorText, css({ marginTop: '10px' }))}>
          {state.message}
        </p>
      )}
    </section>
  )
}
