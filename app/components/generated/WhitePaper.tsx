import { css } from '../../../styled-system/css'

type ProcessStep = { phase: string; does: string; produces: string }
type Decision = { decision: string; why: string }
type Reference = { title: string; url: string; note?: string }

type Props = {
  context?: string
  constraints?: string[]
  process?: ProcessStep[]
  decisions?: Decision[]
  references?: Reference[]
}

const heading = css({
  textStyle: 'sm',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  fontWeight: 'bold',
  mb: '2',
})

export function WhitePaper({ context, constraints, process, decisions, references }: Props) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '7', mt: '7' })}>
      {context && (
        <div>
          <h3 className={heading}>Context</h3>
          <p
            className={css({
              textStyle: 'base',
              lineHeight: 'loose',
              color: 'text',
              maxWidth: '65ch',
            })}
          >
            {context}
          </p>
        </div>
      )}
      {constraints && constraints.length > 0 && (
        <div>
          <h3 className={heading}>Constraints</h3>
          <ul
            className={css({
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            {constraints.map((c) => (
              <li key={c} className={css({ textStyle: 'base', color: 'textMuted' })}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {process && process.length > 0 && (
        <div>
          <h3 className={heading}>Process</h3>
          <ol
            className={css({
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
            })}
          >
            {process.map((step, i) => (
              <li
                key={step.phase}
                className={css({
                  display: 'grid',
                  gridTemplateColumns: '2ch 1fr',
                  gap: '3',
                  borderTop: '1px solid',
                  borderColor: 'border',
                  pt: '3',
                })}
              >
                <span className={css({ textStyle: 'sm', color: 'textFaint' })}>{i + 1}</span>
                <div>
                  <div className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>
                    {step.phase}
                  </div>
                  <div className={css({ textStyle: 'sm', color: 'textMuted', mt: '1' })}>
                    {step.does}
                  </div>
                  <div className={css({ textStyle: 'sm', color: 'accent', mt: '1' })}>
                    Produces: {step.produces}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {decisions && decisions.length > 0 && (
        <div>
          <h3 className={heading}>Decisions</h3>
          <ul
            className={css({
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
            })}
          >
            {decisions.map((d) => (
              <li
                key={d.decision}
                className={css({ borderTop: '1px solid', borderColor: 'border', pt: '3' })}
              >
                <div className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>
                  {d.decision}
                </div>
                <div className={css({ textStyle: 'sm', color: 'textMuted', mt: '1' })}>{d.why}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {references && references.length > 0 && (
        <div>
          <h3 className={heading}>References</h3>
          <ul
            className={css({
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            {references.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  className={css({ color: 'accent', fontWeight: 'bold', textStyle: 'sm' })}
                >
                  {r.title}
                </a>
                {r.note && (
                  <span className={css({ textStyle: 'sm', color: 'textMuted' })}> · {r.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
