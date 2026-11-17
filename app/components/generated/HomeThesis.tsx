import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { ThesisTop } from './ThesisTop'

const word = css({ display: 'block', color: 'fieldInk' })

function yearSpan(): string {
  const years = projects.map((p) => p.year)
  return `${Math.min(...years)}–${Math.max(...years)}`
}

export function HomeThesis() {
  return (
    <>
      <ThesisTop />
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontStyle: 'italic',
          fontVariant: 'small-caps',
          textStyle: '3xl',
          fontSize: { base: 'clamp(32px, 8.5vw, 60px)', lg: 'clamp(32px, 3.2vw, 52px)' },
          lineHeight: '0.98',
          letterSpacing: '0.01em',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          margin: '0',
          lg: { marginTop: 'clamp(24px, 5vh, 56px)' },
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span className={word}>Every</span>
        <span className={word}>project</span>
        <span className={word}>started</span>
        <span className={word}>as&nbsp;an</span>
        <span className={css({ display: 'block', color: 'accentAlt' })}>experiment.</span>
      </h1>
      <div
        className={css({
          fontFamily: 'display',
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginTop: 'auto',
          paddingTop: '18px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        A work log · {yearSpan()} · the index is the proof
      </div>
    </>
  )
}
