import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <div
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(14px, 3vw, 24px)',
        paddingBottom: 'clamp(30px, 5vw, 52px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textStyle: '3xl',
          lineHeight: '1',
        })}
      >
        No project by that name
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '3',
          fontWeight: 'bold',
          color: 'accent',
        })}
      >
        See all work →
      </a>
    </div>
  )
}
