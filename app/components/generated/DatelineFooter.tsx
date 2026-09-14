import { css } from '../../../styled-system/css'

export function DatelineFooter({ email }: { email: string }) {
  return (
    <footer
      className={css({
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        bg: 'bg',
        padding: { base: '7 5 10', lg: '32px 5vw 56px' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2 5',
          alignItems: 'baseline',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'base',
          color: 'text',
          paddingBottom: '4',
        })}
      >
        <span>Ashburn, VA</span>
        <span>·</span>
        <span>Monday, September 14, 2026</span>
        <a
          href={`mailto:${email}`}
          className={css({
            marginLeft: 'auto',
            color: 'accentAlt',
            fontWeight: 'bold',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          })}
        >
          {email}
        </a>
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2 5',
          fontSize: 'sm',
          color: 'textMuted',
          borderTop: '1px solid',
          borderColor: 'border',
          padding: '4 0',
          marginBottom: '4',
        })}
      >
        <span>
          Lions <b className={css({ color: 'text', fontWeight: 'bold' })}>31–30</b>
        </span>
        <span>
          Tigers <b className={css({ color: 'text', fontWeight: 'bold' })}>8–1</b>
        </span>
        <span>
          SPY <b className={css({ color: 'text', fontWeight: 'bold' })}>764.29</b> +0.85%
        </span>
        <span>
          Aldie <b className={css({ color: 'text', fontWeight: 'bold' })}>69.6°F</b> clear
        </span>
        <span>
          Moon <b className={css({ color: 'text', fontWeight: 'bold' })}>12%</b> waxing
        </span>
        <span>
          AQI <b className={css({ color: 'text', fontWeight: 'bold' })}>Good</b>
        </span>
      </div>
      <p
        className={css({
          fontStyle: 'italic',
          fontSize: 'sm',
          color: 'textFaint',
          maxWidth: '60ch',
          borderTop: '1px dotted',
          borderColor: 'border',
          paddingTop: '4',
        })}
      >
        “You don't have to be great to start, but you have to start to be great.” Zig Ziglar
      </p>
    </footer>
  )
}
