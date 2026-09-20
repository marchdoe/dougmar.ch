import { css } from '../../styled-system/css'
import {
  type Run,
  type StageRow,
  formatDuration,
  formatModel,
  formatUsd,
  runStages,
  runWallClockMs,
} from '../lib/archive-run'

/**
 * The run, stage by stage, on the day page — #415.
 *
 * One row per agent call or gate, in the order the night ran them, each with
 * a mark whose width is its share of the longest stage. The mark is what makes
 * the page legible at a glance: the Art Director's five minutes against a
 * gate's twenty seconds, three mockup rounds as three rows. The closing row is
 * the run's wall clock and its total, which replaced the lone Cost row in the
 * rail.
 *
 * A day with a trace and no cost file shows time only. The page decides what
 * to say when there is no run at all.
 *
 * The mark's width arrives at render time, so it is passed as a CSS custom
 * property that a static class reads, the same way the swatches above this
 * section pass their color.
 */

const list = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  maxWidth: '72ch',
  marginBottom: '28px',
})

const row = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
  columnGap: '14px',
  rowGap: '7px',
  alignItems: 'baseline',
  paddingY: '10px',
  borderBottom: '1px solid',
  borderColor: 'archive.lineSoft',
  fontSize: 'archive.small',
  color: 'archive.text',
  '&[data-kind="gate"]': { color: 'archive.dim' },
})

const closing = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
  columnGap: '14px',
  alignItems: 'baseline',
  paddingTop: '12px',
  borderTop: '1px solid',
  borderColor: 'archive.line',
  fontSize: 'archive.small',
  color: 'archive.text',
})

const head = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  columnGap: '10px',
  rowGap: '2px',
  minWidth: 0,
})

const round = css({
  fontSize: 'archive.label',
  letterSpacing: '0.08em',
  color: 'archive.dim',
})

const model = css({
  fontSize: 'archive.label',
  letterSpacing: '0.08em',
  color: 'archive.faint',
})

const closingKey = css({
  fontSize: 'archive.label',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'archive.dim',
})

const num = css({
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

const est = css({
  fontSize: 'archive.label',
  color: 'archive.faint',
  whiteSpace: 'nowrap',
})

const track = css({ gridColumn: '1 / -1', minWidth: 0 })

const mark = css({
  display: 'block',
  height: '3px',
  width: 'calc(var(--share) * 100%)',
  minWidth: '2px',
  background: 'archive.text',
  '[data-kind="gate"] &': { background: 'archive.faint' },
})

/** Label, round and model, wrapping onto a second line when the row is narrow. */
function Head({ stage }: { stage: StageRow }) {
  return (
    <span className={head}>
      <span>{stage.label}</span>
      {stage.round != null ? <span className={round}>round {stage.round}</span> : null}
      {stage.model ? <span className={model}>{formatModel(stage.model)}</span> : null}
    </span>
  )
}

/** Two cells, cost and its `est.` flag, so every row keeps the columns aligned. */
function Cost({ costUsd, estimated }: { costUsd: number | null; estimated: boolean }) {
  return (
    <>
      <span className={num}>{costUsd != null ? formatUsd(costUsd) : ''}</span>
      <span className={est}>{estimated ? 'est.' : ''}</span>
    </>
  )
}

/** The proportional mark; nothing when the row has no duration to draw. */
function Mark({ share }: { share: number | null }) {
  if (share == null) return null
  return (
    <span className={track}>
      <span className={mark} style={{ '--share': share.toFixed(3) } as React.CSSProperties} />
    </span>
  )
}

const shareOf = (durationMs: number | null, longest: number): number | null =>
  durationMs != null && longest > 0 ? durationMs / longest : null

function Stage({ stage, longest, priced }: { stage: StageRow; longest: number; priced: boolean }) {
  return (
    <li className={row} data-kind={stage.kind}>
      <Head stage={stage} />
      <span className={num}>
        {stage.durationMs != null ? formatDuration(stage.durationMs) : ''}
      </span>
      {priced ? <Cost costUsd={stage.costUsd} estimated={stage.estimated} /> : null}
      <Mark share={shareOf(stage.durationMs, longest)} />
    </li>
  )
}

export function RunStages({ run }: { run: Run }) {
  const stages = runStages(run)
  const longest = stages.reduce((n, s) => Math.max(n, s.durationMs ?? 0), 0)
  const priced = run.calls !== null
  const wallClock = runWallClockMs(run)
  const hasClosing = wallClock != null || run.totalUsd != null
  if (stages.length === 0 && !hasClosing) return null

  return (
    <ol className={list}>
      {stages.map((stage) => (
        <Stage
          key={`${stage.label}-${stage.round ?? 0}`}
          stage={stage}
          longest={longest}
          priced={priced}
        />
      ))}
      {hasClosing ? (
        <li className={closing}>
          <span className={closingKey}>Run</span>
          <span className={num}>{wallClock != null ? formatDuration(wallClock) : ''}</span>
          {run.totalUsd != null ? <Cost costUsd={run.totalUsd} estimated={run.estimated} /> : null}
        </li>
      ) : null}
    </ol>
  )
}
