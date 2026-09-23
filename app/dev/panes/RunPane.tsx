import { Checkbox } from '@base-ui/react/checkbox'
import { css, cva } from '../../../styled-system/css'
import type { ArchiveEntry } from '../../server/archive'
import { fmtElapsed } from '../lib/format'
import type { PipelineStatus } from '../lib/pipeline'
import type { PipelineRun } from '../lib/usePipelineRun'
import { paneHeading } from '../styles'
import { ErrorSection } from './run/ErrorSection'
import { IdleTracker } from './run/IdleTracker'
import { ProgressSection } from './run/ProgressSection'
import { SuccessSection } from './run/SuccessSection'
import { WeightsPicker } from './run/WeightsPicker'

const controls = css({ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' })

const runButton = cva({
  base: {
    background: 'devPanel.cyan',
    color: 'devPanel.bg',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 24px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '.05em',
    _disabled: { cursor: 'default' },
  },
  variants: {
    status: {
      running: { background: 'devPanel.muted', color: 'devPanel.dim' },
      cooldown: { background: 'devPanel.ghost', color: 'devPanel.dim', opacity: 0.7 },
      ready: {},
    },
  },
})

const dryRunLabel = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  color: 'devPanel.dim',
})
const checkbox = css({
  width: '13px',
  height: '13px',
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid',
  borderColor: 'devPanel.muted',
  borderRadius: '2px',
  background: 'devPanel.card',
  color: 'devPanel.bg',
  cursor: 'pointer',
  '&[data-checked]': { background: 'devPanel.cyan', borderColor: 'devPanel.cyan' },
  '&[data-disabled]': { cursor: 'default', opacity: 0.5 },
  '&:focus-visible': { outline: '2px solid', outlineColor: 'devPanel.cyan', outlineOffset: '2px' },
})
const checkboxIndicator = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
})

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M1.5 5.2 3.8 7.5 8.5 2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function runLabel(status: PipelineStatus, elapsedMs: number, cooldownLeft: number): string {
  if (status === 'running') return `RUNNING... ${fmtElapsed(elapsedMs)}`
  if (status === 'cooldown') return `COOLDOWN ${cooldownLeft}s`
  return 'RUN PIPELINE'
}

/** The run button, with its clock or countdown, and the dry-run switch. */
function RunControls({ pipeline }: { pipeline: PipelineRun }) {
  return (
    <div className={controls}>
      <button
        type="button"
        data-testid="run-pipeline-btn"
        onClick={pipeline.run}
        disabled={pipeline.isRunDisabled}
        className={runButton({
          status:
            pipeline.status === 'running' || pipeline.status === 'cooldown'
              ? pipeline.status
              : 'ready',
        })}
      >
        {runLabel(pipeline.status, pipeline.elapsedMs, pipeline.cooldownLeft)}
      </button>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: Checkbox.Root renders a hidden native <input> inside this label, which associates it; Biome can't see through the component. */}
      <label className={dryRunLabel}>
        <Checkbox.Root
          className={checkbox}
          checked={pipeline.dryRun}
          onCheckedChange={pipeline.setDryRun}
          disabled={pipeline.isRunDisabled}
        >
          <Checkbox.Indicator className={checkboxIndicator}>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        Dry run (no commit)
      </label>
    </div>
  )
}

/** Weights, the run button, and the run itself: idle, running, passed or failed. */
export function RunPane({
  pipeline,
  archive,
  signalDate,
}: {
  pipeline: PipelineRun
  archive: ArchiveEntry[]
  signalDate: string
}) {
  const { status, result, isRunDisabled } = pipeline

  return (
    <>
      <h2 className={paneHeading}>// RUN PIPELINE</h2>

      <WeightsPicker
        weights={pipeline.weights}
        setWeights={pipeline.setWeights}
        disabled={isRunDisabled}
      />

      <RunControls pipeline={pipeline} />

      {status === 'running' && (
        <ProgressSection
          phases={pipeline.phases}
          logLines={pipeline.logLines}
          attemptNum={pipeline.attemptNum}
          logEndRef={pipeline.logEndRef}
          elapsedMs={pipeline.elapsedMs}
        />
      )}

      {status === 'idle' && <IdleTracker phases={pipeline.phases} />}

      <div>
        {(status === 'success' || status === 'cooldown') && result && (
          <SuccessSection
            result={result}
            attemptNum={pipeline.attemptNum}
            archive={archive}
            phases={pipeline.phases}
            onRunAgain={pipeline.startCooldown}
            cooldownLeft={pipeline.cooldownLeft}
            isCooldown={status === 'cooldown'}
            signalDate={signalDate}
          />
        )}
      </div>
      <div role="alert">
        {status === 'error' && result && (
          <ErrorSection
            error={result.error ?? 'Unknown error'}
            totalMs={result.totalMs ?? 0}
            onRetry={pipeline.run}
          />
        )}
      </div>
    </>
  )
}
