import { css } from '../../../styled-system/css'

type Step = { phase: string; does: string; produces: string }

export function WhitePaperProcess({ process }: { process: Step[] }) {
  return (
    <div
      className={css({
        bg: 'bg',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: '7',
        borderTop: '1px solid',
        borderColor: 'border',
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          display: 'block',
          marginBottom: '5',
        })}
      >
        Process
      </span>
      <ol
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '5',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        })}
      >
        {process.map((step, i) => (
          <li
            key={step.phase}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '2em 1fr 1fr' },
              gap: '3',
              alignItems: 'baseline',
              borderBottom: '1px solid',
              borderColor: 'border',
              paddingBottom: '4',
            })}
          >
            <span
              className={css({
                textStyle: 'xs',
                color: 'accent',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {i + 1}
            </span>
            <span className={css({ textStyle: 'sm', color: 'text' })}>{step.does}</span>
            <span className={css({ textStyle: 'sm', color: 'textMuted' })}>→ {step.produces}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
