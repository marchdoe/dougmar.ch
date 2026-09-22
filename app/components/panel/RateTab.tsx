import { useState } from 'react'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { css, cx } from '../../../styled-system/css'
import {
  sectionTitle,
  mutedText,
  fieldLabel,
  field,
  textArea,
  button,
  gradeButton,
  errorText,
  successText,
  inlineLink,
  dateMuted,
} from './styles'
import { submitRating, type Grade, type RatingIssue } from './api'

function prettyDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

function SavedNote({ url }: { url: string }) {
  return (
    <p className={cx(successText, css({ marginTop: '10px' }))}>
      Saved —{' '}
      <a className={inlineLink} href={url}>
        view issue
      </a>
      . Harvested on the next run.
    </p>
  )
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'done'; url: string }
  | { kind: 'error'; message: string }

function NothingWaiting({ state }: { state: SubmitState }) {
  return (
    <>
      <p className={mutedText}>Nothing waiting for a rating. 🎉</p>
      {state.kind === 'done' && <SavedNote url={state.url} />}
    </>
  )
}

/**
 * The list shrinks after a save and onRated's refetch. A chosen date that is
 * no longer unrated falls back to the newest one, so a second click can never
 * file a duplicate on the day just rated (#330).
 */
function activeFrom(unrated: RatingIssue[], chosen: string): string {
  return unrated.some((i) => i.date === chosen) ? chosen : (unrated[0]?.date ?? '')
}

export function RateTab({ unrated, onRated }: { unrated: RatingIssue[]; onRated: () => void }) {
  const [chosenDate, setActiveDate] = useState(unrated[0]?.date ?? '')
  const activeDate = activeFrom(unrated, chosenDate)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [worked, setWorked] = useState('')
  const [didnt, setDidnt] = useState('')
  const [tryNext, setTryNext] = useState('')
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })

  if (unrated.length === 0) return <NothingWaiting state={state} />

  const submit = async () => {
    if (!grade || !activeDate) return
    setState({ kind: 'busy' })
    try {
      const res = await submitRating({ date: activeDate, grade, worked, didnt, try: tryNext })
      setState({ kind: 'done', url: res.issueUrl })
      setGrade(null)
      setWorked('')
      setDidnt('')
      setTryNext('')
      onRated()
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Failed' })
    }
  }

  return (
    <section>
      <h2 className={sectionTitle}>
        {prettyDate(activeDate)} <span className={dateMuted}>· {activeDate}</span>
      </h2>
      <p className={fieldLabel} id="grade-label">
        Grade
      </p>
      <RadioGroup
        aria-labelledby="grade-label"
        value={grade}
        onValueChange={(value) => setGrade(value as Grade)}
        className={css({
          display: 'flex',
          gap: '8px',
          marginBottom: '14px',
        })}
      >
        {/* No aria-label: the letter is the accessible name, same as the plain buttons this replaced. */}
        {(['A', 'B', 'C', 'D'] as const).map((g) => (
          <Radio.Root key={g} value={g} className={gradeButton}>
            {g}
          </Radio.Root>
        ))}
      </RadioGroup>
      <div className={field}>
        <label>
          <span className={fieldLabel}>What worked</span>
          <textarea
            className={textArea}
            value={worked}
            onChange={(e) => setWorked(e.target.value)}
            rows={2}
          />
        </label>
      </div>
      <div className={field}>
        <label>
          <span className={fieldLabel}>What didn't</span>
          <textarea
            className={textArea}
            value={didnt}
            onChange={(e) => setDidnt(e.target.value)}
            rows={2}
          />
        </label>
      </div>
      <div className={field}>
        <label>
          <span className={fieldLabel}>Try next</span>
          <textarea
            className={textArea}
            value={tryNext}
            onChange={(e) => setTryNext(e.target.value)}
            rows={2}
          />
        </label>
      </div>
      <button
        type="button"
        disabled={!grade || state.kind === 'busy'}
        onClick={submit}
        className={cx(css({ width: '100%' }), button({ kind: 'primary' }))}
      >
        {state.kind === 'busy' ? 'Submitting…' : 'Submit rating'}
      </button>
      {state.kind === 'done' && <SavedNote url={state.url} />}
      {state.kind === 'error' && (
        <p role="alert" className={cx(errorText, css({ marginTop: '10px' }))}>
          {state.message}
        </p>
      )}
      {unrated.length > 1 && (
        <aside className={css({ marginTop: '20px' })}>
          <h3 className={fieldLabel}>Also unrated</h3>
          <ul
            className={css({
              listStyle: 'none',
              padding: '0',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            })}
          >
            {unrated
              .filter((i) => i.date !== activeDate)
              .map((i) => (
                <li key={i.number}>
                  <button
                    type="button"
                    className={button({ kind: 'secondary' })}
                    onClick={() => setActiveDate(i.date)}
                  >
                    {i.date}
                  </button>
                </li>
              ))}
          </ul>
        </aside>
      )}
    </section>
  )
}
