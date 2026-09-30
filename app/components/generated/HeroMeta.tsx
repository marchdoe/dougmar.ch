import { css } from '../../../styled-system/css'

export function HeroMeta({ kicker, line }: { kicker: string; line: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '1',
        paddingTop: '1',
        textAlign: { base: 'left', sm: 'right' },
      })}
    >
      <span
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {kicker}
      </span>
      {line ? (
        <span
          className={css({
            textStyle: 'sm',
            color: 'textMuted',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {line}
        </span>
      ) : null}
    </div>
  )
}
