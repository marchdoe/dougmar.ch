import { css } from '../../../styled-system/css'

type Decision = { decision: string; why: string }

export function WhitePaperDecisions({ decisions }: { decisions?: Decision[] }) {
  if (!decisions || decisions.length === 0) return null
  return (
    <section
      className={css({
        bg: 'surface',
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
        Decisions
      </p>
      {decisions.map((d) => (
        <div
          key={d.decision}
          className={css({ padding: '3 0', borderBottom: '1px solid', borderColor: 'border' })}
        >
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'text',
            })}
          >
            {d.decision}
          </p>
          <p className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>{d.why}</p>
        </div>
      ))}
    </section>
  )
}
