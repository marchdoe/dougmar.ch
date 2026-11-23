import { css } from '../../../styled-system/css'

export function BandHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        rowGap: '2',
        columnGap: '4',
        marginBottom: 'clamp(22px, 3vw, 40px)',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xl',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        {title}
      </h2>
      <span className={css({ textStyle: 'xs', color: 'textMuted' })}>{sub}</span>
    </div>
  )
}
