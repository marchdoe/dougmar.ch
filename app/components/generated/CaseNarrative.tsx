import { css } from '../../../styled-system/css'

type Props = { problem?: string; approach?: string; outcome?: string }

export function CaseNarrative({ problem, approach, outcome }: Props) {
  const parts = [
    { label: 'Problem', text: problem },
    { label: 'Approach', text: approach },
    { label: 'Outcome', text: outcome },
  ]
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      {parts.map(
        (p) =>
          p.text && (
            <div key={p.label}>
              <div
                className={css({
                  textStyle: 'sm',
                  letterSpacing: 'widest',
                  textTransform: 'uppercase',
                  color: 'accent',
                  fontWeight: 'bold',
                  mb: '2',
                })}
              >
                {p.label}
              </div>
              <p
                className={css({
                  textStyle: 'base',
                  lineHeight: 'loose',
                  color: 'text',
                  maxWidth: '65ch',
                })}
              >
                {p.text}
              </p>
            </div>
          )
      )}
    </div>
  )
}
