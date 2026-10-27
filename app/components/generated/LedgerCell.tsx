import { css } from '../../../styled-system/css'

type Props = { label: string; value: string; up?: string; sub?: string }

export function LedgerCell({ label, value, up, sub }: Props) {
  return (
    <div
      className={css({
        borderRight: '1px solid',
        borderRightColor: 'fieldBorder',
        borderBottom: '1px solid',
        borderBottomColor: 'fieldBorder',
        paddingBlock: '16px',
        paddingInline: { base: '12px', lg: '18px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        minHeight: '96px',
        minWidth: '0',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: '2xs',
          fontWeight: 'bold',
          color: 'fieldInkMuted',
        })}
      >
        {label}
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'base', lg: 'md' },
          lineHeight: '1.15',
          color: 'fieldInk',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {value}
        {up ? <span className={css({ marginLeft: '0.3em', color: 'fieldInk' })}>{up}</span> : null}
      </span>
      {sub ? (
        <span
          className={css({
            fontFamily: 'body',
            fontSize: '2xs',
            lineHeight: '1.4',
            color: 'fieldInkMuted',
          })}
        >
          {sub}
        </span>
      ) : null}
    </div>
  )
}
