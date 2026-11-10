import { css } from '../../../styled-system/css'

type Props = { href: string; title: string; type: string; year: number }

export function WorkRow({ href, title, type, year }: Props) {
  return (
    <a
      href={href}
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: '20px',
        rowGap: '12px',
        alignItems: 'baseline',
        paddingBlock: 'clamp(16px, 2vw, 22px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        minHeight: '44px',
        color: 'text',
        _hover: { textDecoration: 'none', color: 'accentAlt' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(22px, 3.4vw, 40px)',
          lineHeight: '1',
          letterSpacing: '-0.01em',
          textTransform: 'lowercase',
          minWidth: '0',
        })}
      >
        {title}
      </span>
      <span
        className={css({
          display: 'flex',
          gap: '14px',
          alignItems: 'baseline',
          justifyContent: 'flex-end',
          fontSize: '2xs',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'textFaint',
          fontWeight: 'bold',
        })}
      >
        <span>{type}</span>
        <span className={css({ color: 'textMuted', fontVariantNumeric: 'tabular-nums' })}>
          {year}
        </span>
      </span>
    </a>
  )
}
