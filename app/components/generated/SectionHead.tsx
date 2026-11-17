import { css } from '../../../styled-system/css'

type Props = { label: string; aside: string; id?: string }

export function SectionHead({ label, aside, id }: Props) {
  return (
    <div
      id={id}
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '16px',
        flexWrap: 'wrap',
        paddingBottom: 'clamp(16px, 3vw, 28px)',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          textStyle: 'sm',
          letterSpacing: 'wide',
          color: 'text',
        })}
      >
        {label}
      </h2>
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariantNumeric: 'tabular-nums',
          textStyle: 'xs',
          letterSpacing: 'wide',
          color: 'textMuted',
        })}
      >
        {aside}
      </span>
    </div>
  )
}
