import { css } from '../../../styled-system/css'

type Decision = { decision: string; why: string }

export function WhitePaperDecisions({ decisions }: { decisions: Decision[] }) {
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
        Decisions
      </span>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}>
        {decisions.map((d) => (
          <div key={d.decision}>
            <p
              className={css({
                textStyle: 'sm',
                fontWeight: '600',
                color: 'text',
                marginBottom: '2',
              })}
            >
              {d.decision}
            </p>
            <p className={css({ textStyle: 'sm', color: 'textMuted' })}>{d.why}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
