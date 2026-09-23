import { css, cva, cx } from '../../../../styled-system/css'
import type { PanelWeights } from '../../lib/pipeline'
import { blockLabel } from '../../styles'

const WEIGHTS = [
  {
    key: 'signals',
    label: 'Signals',
    desc: 'How much weather, sports, holidays drive the design',
  },
  {
    key: 'inspiration',
    label: 'Inspiration',
    desc: 'How much Awwwards/design trends drive composition',
  },
  {
    key: 'ratings',
    label: 'Ratings',
    desc: 'How much past feedback influences decisions',
  },
  {
    key: 'risk',
    label: 'Risk',
    desc: 'How experimental vs safe the design should be',
  },
] as const

const wrap = css({ marginBottom: '16px' })
const heading = css({ marginBottom: '10px' })
const row = css({ display: 'flex', alignItems: 'center', marginBottom: '6px', gap: '10px' })
const rowLabel = css({
  fontSize: '10px',
  color: 'devPanel.secondary',
  minWidth: '72px',
  cursor: 'help',
})
const scale = css({ display: 'flex', gap: '3px' })

const step = cva({
  base: {
    width: '22px',
    height: '22px',
    borderRadius: '3px',
    border: '1px solid',
    borderColor: 'devPanel.border',
    background: 'devPanel.card',
    color: 'devPanel.muted',
    fontSize: '9px',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    _disabled: { cursor: 'default' },
  },
  variants: {
    selected: {
      true: {
        borderColor: 'devPanel.cyan',
        background: 'devPanel.cyan/15',
        color: 'devPanel.cyan',
      },
    },
  },
})

/** The four creative weights as 0-10 scales; risk also offers A, for auto. */
export function WeightsPicker({
  weights,
  setWeights,
  disabled,
}: {
  weights: PanelWeights
  setWeights: (v: PanelWeights) => void
  disabled: boolean
}) {
  return (
    <div className={wrap}>
      <div className={cx(blockLabel, heading)}>Creative Weights</div>

      {WEIGHTS.map(({ key, label, desc }) => (
        <div key={key} className={row}>
          <span title={desc} className={rowLabel}>
            {label}
          </span>
          <div className={scale}>
            {key === 'risk' && (
              <button
                type="button"
                title="Auto — derive risk 3-10 from the build date"
                onClick={() => setWeights({ ...weights, risk: null })}
                disabled={disabled}
                className={step({ selected: weights.risk === null })}
              >
                A
              </button>
            )}
            {Array.from({ length: 11 }, (_, n) => (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: n is the weight value itself (0-10), not a list position.
                key={n}
                onClick={() => setWeights({ ...weights, [key]: n })}
                disabled={disabled}
                className={step({ selected: weights[key] === n })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
