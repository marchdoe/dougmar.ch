import { useState } from 'react'
import { Slider } from '@base-ui/react/slider'
import { Checkbox } from '@base-ui/react/checkbox'
import { css, cx } from '../../../styled-system/css'
import {
  sliderRow,
  sliderLabelRow,
  sliderControl,
  sliderTrack,
  sliderIndicator,
  sliderThumb,
  mutedText,
  button,
  errorText,
  successText,
  checkboxRow,
  checkboxBox,
  checkboxIndicator,
} from './styles'
import { saveWeights, type Weights } from './api'

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

const ROWS: Array<{ key: keyof Weights; label: string; desc: string }> = [
  { key: 'signals', label: 'Signals', desc: 'How much daily signals steer content' },
  { key: 'inspiration', label: 'Inspiration', desc: 'How much references steer style' },
  { key: 'ratings', label: 'Ratings', desc: 'How much past feedback influences decisions' },
  { key: 'risk', label: 'Risk', desc: 'How bold the design gestures get' },
]

/** Where the slider lands when Risk is switched off Auto. Mid-range, not the old pinned 8. */
const RISK_WHEN_SET = 5

export function WeightsTab({ initial }: { initial: Weights }) {
  const [weights, setWeights] = useState<Weights>(initial)
  const [state, setState] = useState<
    { kind: 'idle' } | { kind: 'busy' } | { kind: 'saved' } | { kind: 'error'; message: string }
  >({ kind: 'idle' })

  // Base UI hands back number | number[]. The computed-key spread this
  // replaced accepted either silently and the PUT validator then returned 400.
  const update = (key: keyof Weights, v: number | readonly number[]) => {
    const n = Array.isArray(v) ? v[0] : v
    if (typeof n !== 'number') return
    setWeights((w) => {
      const next: Weights = { ...w }
      next[key] = n
      return next
    })
  }

  const save = async () => {
    setState({ kind: 'busy' })
    try {
      await saveWeights(weights)
      setState({ kind: 'saved' })
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  return (
    <section>
      {ROWS.map(({ key, label, desc }) => {
        // Risk alone can be unset, and unset is the better default: the
        // pipeline then derives it 3-10 from the build date instead of sending
        // the same prompt sentence every day.
        const auto = key === 'risk' && weights.risk === null
        const value = auto ? RISK_WHEN_SET : (weights[key] as number)
        return (
          <div key={key} className={sliderRow}>
            <Slider.Root
              min={0}
              max={10}
              step={1}
              disabled={auto}
              value={value}
              onValueChange={(v) => update(key, v)}
            >
              <div className={sliderLabelRow}>
                <Slider.Label>{label}</Slider.Label>
                <span>{auto ? 'auto' : value}</span>
              </div>
              <Slider.Control className={sliderControl}>
                <Slider.Track className={sliderTrack}>
                  <Slider.Indicator className={sliderIndicator} />
                  <Slider.Thumb className={sliderThumb} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
            <p className={mutedText}>{desc}</p>
            {key === 'risk' && (
              // biome-ignore lint/a11y/noLabelWithoutControl: Checkbox.Root renders a hidden native <input> inside this label, which associates it; Biome can't see through the component.
              <label className={cx(checkboxRow, css({ marginTop: '6px' }))}>
                <Checkbox.Root
                  className={checkboxBox}
                  checked={auto}
                  onCheckedChange={(checked) =>
                    setWeights((w) => ({ ...w, risk: checked ? null : RISK_WHEN_SET }))
                  }
                >
                  <Checkbox.Indicator className={checkboxIndicator}>
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                Auto — derive 3-10 from the build date
              </label>
            )}
          </div>
        )
      })}
      <button
        type="button"
        disabled={state.kind === 'busy'}
        onClick={save}
        className={button({ kind: 'primary' })}
      >
        {state.kind === 'busy' ? 'Saving…' : 'Save weights'}
      </button>
      {state.kind === 'saved' && (
        <p className={cx(successText, css({ marginTop: '10px' }))}>
          Saved — applies to the next run.
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
