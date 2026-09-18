import { css } from '../../../styled-system/css'

type Decision = { decision: string; why: string }

export function DecisionsBlock({ items }: { items: Decision[] }) {
  return (
    <section
      className={css({
        bg: 'bg',
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
        Decisions
      </p>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
        {items.map((item) => (
          <div
            key={item.decision}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              borderLeft: '3px solid',
              borderColor: 'borderStrong',
              paddingLeft: '4',
            })}
          >
            <p
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'md',
                color: 'text',
              })}
            >
              {item.decision}
            </p>
            <p className={css({ fontSize: 'base', color: 'textMuted' })}>{item.why}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
