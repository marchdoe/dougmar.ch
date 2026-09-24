import { css } from '../../../styled-system/css'

export function ZoneHead({ title, kicker }: { title: string; kicker: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        rowGap: '8px',
        columnGap: '16px',
        paddingBottom: '14px',
        marginBottom: '28px',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 500,
          fontSize: 'lg',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        {title}
      </h2>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          fontWeight: 600,
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        {kicker}
      </span>
    </div>
  )
}
