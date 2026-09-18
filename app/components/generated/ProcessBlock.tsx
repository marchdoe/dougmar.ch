import { css } from '../../../styled-system/css'

type Step = { phase: string; does: string; produces: string }

export function ProcessBlock({ steps }: { steps: Step[] }) {
  return (
    <section
      className={css({
        bg: 'surface',
        color: 'text',
        padding: { base: '5', md: '7' },
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      <p
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          fontSize: 'xs',
          color: 'textFaint',
          marginBottom: '3',
        })}
      >
        Process
      </p>
      <ol className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        {steps.map((step, i) => (
          <li
            key={step.phase}
            className={css({ display: 'flex', gap: '4', alignItems: 'baseline' })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'lg',
                color: 'textFaint',
                minWidth: '32px',
              })}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'md',
                  color: 'text',
                })}
              >
                {step.phase}
              </p>
              <p className={css({ fontSize: 'base', color: 'textMuted', marginTop: '1' })}>
                {step.does}
              </p>
              <p className={css({ fontSize: 'sm', color: 'accentAlt', marginTop: '1' })}>
                &rarr; {step.produces}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
