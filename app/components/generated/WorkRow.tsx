import { css } from '../../../styled-system/css'

type Props = { num: string; title: string; type: string; year: number; href: string }

export function WorkRow({ num, title, type, year, href }: Props) {
  return (
    <a
      href={href}
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'auto 1fr', lg: '64px 1fr 180px' },
        alignItems: 'center',
        columnGap: { base: '12px', lg: '20px' },
        rowGap: '1',
        paddingBlock: { base: '16px', lg: '20px' },
        paddingInline: '4px',
        minHeight: '44px',
        borderBottom: '1px solid',
        borderColor: 'border',
        color: 'text',
        _first: { borderTopWidth: '1px', borderTopStyle: 'solid' },
        '&:hover [data-part=title]': { color: 'accent' },
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          color: 'textFaint',
          letterSpacing: 'wide',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {num}
      </span>
      <span
        data-part="title"
        className={css({
          fontFamily: 'display',
          fontSize: 'xl',
          lineHeight: '1.1',
          color: 'text',
          minWidth: '0',
        })}
      >
        {title}
      </span>
      <span
        className={css({
          gridColumn: { base: '2', lg: '3' },
          display: 'flex',
          flexDirection: { base: 'row', lg: 'column' },
          alignItems: { base: 'baseline', lg: 'flex-end' },
          columnGap: '3',
          rowGap: '2px',
          textAlign: { base: 'left', lg: 'right' },
        })}
      >
        <span
          className={css({
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            color: 'textFaint',
          })}
        >
          {type}
        </span>
        <span
          className={css({
            fontSize: 'sm',
            color: 'textMuted',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {year}
        </span>
      </span>
    </a>
  )
}
