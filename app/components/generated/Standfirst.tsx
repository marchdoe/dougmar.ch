import { css } from '../../../styled-system/css'

export function Standfirst() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bgAlt',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        paddingBlock: 'clamp(40px,5vw,72px)',
        paddingInline: 'var(--pad)',
      })}
    >
      <p
        className={css({
          fontSize: 'clamp(20px,2.6vw,28px)',
          lineHeight: '1.5',
          maxWidth: '40ch',
          color: 'text',
        })}
      >
        Ben James is twenty-one under and the week isn't over. Gerard, Kirk, McCarthy and Ortiz are
        stacked behind him with holes left to play. A lead this size, mid-tournament, is the one
        number worth watching.
      </p>
      <p
        className={css({
          marginTop: '18px',
          textStyle: 'sm',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'textMuted',
        })}
      >
        Doug March · follows golf, builds 15th Club
      </p>
    </section>
  )
}
