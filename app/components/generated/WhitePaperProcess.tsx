import { css } from '../../../styled-system/css'

type Phase = { phase: string; does: string; produces: string }

export function WhitePaperProcess({ process }: { process?: Phase[] }) {
  if (!process || process.length === 0) return null
  return (
    <section
      className={css({
        bg: 'bgAlt',
        padding: { base: '8 5', lg: '48px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      <p
        className={css({
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '4',
        })}
      >
        Process
      </p>
      <ol className={css({ listStyle: 'none', padding: 0 })}>
        {process.map((step, i) => (
          <li
            key={step.phase}
            className={css({
              display: 'flex',
              gap: '4',
              padding: '3 0',
              borderBottom: '1px solid',
              borderColor: 'border',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'textFaint',
                flex: '0 0 32px',
              })}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  color: 'text',
                })}
              >
                {step.phase}
              </p>
              <p className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
                {step.does} → {step.produces}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
