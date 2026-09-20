import { css } from '../../../styled-system/css'

type Paper = {
  context?: string
  constraints?: string[]
  process?: { phase: string; does: string; produces: string }[]
  decisions?: { decision: string; why: string }[]
  references?: { title: string; url: string; note?: string }[]
}

// Constraints are hand-maintained content; only the surface form (em dash,
// a stray self-reference to "redesigns") is cleaned at render time.
function cleanConstraint(text: string): string {
  return text.replace(/\s*—\s*/g, ', ').replace(/redesigns itself/gi, 'regenerates its layout')
}

export function WhitePaperSection({ paper }: { paper: Paper }) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bgAlt',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {paper.context && (
        <div className={blockClass}>
          <div className={labelClass}>context</div>
          <p className={proseClass}>{paper.context.replace(/\s*—\s*/g, ', ')}</p>
        </div>
      )}
      {paper.constraints && paper.constraints.length > 0 && (
        <div className={blockClass}>
          <div className={labelClass}>constraints</div>
          <ul
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3',
              marginTop: '4',
              padding: 0,
              listStyle: 'none',
            })}
          >
            {paper.constraints.map((c) => (
              <li key={c} className={tagClass}>
                {cleanConstraint(c)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {paper.process && paper.process.length > 0 && (
        <div className={blockClass}>
          <div className={labelClass}>process</div>
          <ol
            className={css({
              padding: 0,
              listStyle: 'none',
              marginTop: '4',
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
            })}
          >
            {paper.process.map((step, i) => (
              <li key={step.phase} className={css({ display: 'flex', gap: '4' })}>
                <span
                  className={css({
                    fontFamily: 'display',
                    color: 'accent',
                    fontWeight: 'bold',
                    fontSize: 'sm',
                    minWidth: '32px',
                  })}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div
                    className={css({
                      fontFamily: 'display',
                      color: 'text',
                      textTransform: 'lowercase',
                      fontSize: 'base',
                    })}
                  >
                    {step.phase}
                  </div>
                  <div
                    className={css({
                      fontFamily: 'body',
                      color: 'textMuted',
                      fontSize: 'sm',
                      marginTop: '1',
                    })}
                  >
                    {step.does}
                  </div>
                  <div
                    className={css({
                      fontFamily: 'body',
                      color: 'textFaint',
                      fontSize: 'xs',
                      marginTop: '1',
                    })}
                  >
                    produces, {step.produces}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {paper.decisions && paper.decisions.length > 0 && (
        <div className={blockClass}>
          <div className={labelClass}>decisions</div>
          <div
            className={css({ display: 'flex', flexDirection: 'column', gap: '5', marginTop: '4' })}
          >
            {paper.decisions.map((d) => (
              <div key={d.decision}>
                <div className={css({ fontFamily: 'display', color: 'text', fontSize: 'base' })}>
                  {d.decision.replace(/\s*—\s*/g, ', ')}
                </div>
                <div
                  className={css({
                    fontFamily: 'body',
                    color: 'textMuted',
                    fontSize: 'sm',
                    marginTop: '1',
                  })}
                >
                  {d.why.replace(/\s*—\s*/g, ', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {paper.references && paper.references.length > 0 && (
        <div className={blockClass}>
          <div className={labelClass}>references</div>
          <div
            className={css({ display: 'flex', flexDirection: 'column', gap: '3', marginTop: '4' })}
          >
            {paper.references.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener"
                className={css({
                  fontFamily: 'display',
                  fontSize: 'sm',
                  color: 'accent',
                  textDecoration: 'underline',
                })}
              >
                {r.title}
                {r.note ? `, ${r.note}` : ''}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

const blockClass = css({
  paddingTop: { base: '6', md: '8' },
  paddingBottom: { base: '6', md: '8' },
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
  borderBottom: '1px solid',
  borderColor: 'border',
})

const labelClass = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accent',
})

const proseClass = css({
  fontFamily: 'body',
  fontSize: 'base',
  color: 'textMuted',
  maxWidth: '62ch',
  marginTop: '4',
})

const tagClass = css({
  fontFamily: 'display',
  fontSize: 'xs',
  color: 'text',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'sm',
  paddingTop: '2',
  paddingBottom: '2',
  paddingLeft: '3',
  paddingRight: '3',
  textTransform: 'lowercase',
})
