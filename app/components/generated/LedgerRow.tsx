import { css } from '../../../styled-system/css'

type Props = { title: string; href: string; year: string; meta: string; note?: string }

export function LedgerRow({ title, href, year, meta, note }: Props) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'baseline',
        rowGap: '6px',
        columnGap: '12px',
        paddingBlock: '16px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <a
        href={href}
        className={css({
          gridColumn: '1',
          fontFamily: 'display',
          fontWeight: 500,
          fontSize: 'lg',
          letterSpacing: 'tight',
          lineHeight: '1.1',
          color: 'text',
          _hover: { color: 'accent' },
        })}
      >
        {title}
      </a>
      <span
        className={css({
          gridColumn: '2',
          gridRow: '1',
          fontFamily: 'body',
          fontSize: 'sm',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          color: 'textMuted',
        })}
      >
        {year}
      </span>
      <span
        className={css({ gridColumn: '1', fontFamily: 'body', fontSize: 'xs', color: 'textFaint' })}
      >
        {meta}
      </span>
      {note ? (
        <p
          className={css({
            gridColumn: '1 / -1',
            marginTop: '6px',
            fontFamily: 'body',
            fontSize: 'sm',
            lineHeight: '1.5',
            color: 'textMuted',
            maxWidth: '46ch',
          })}
        >
          {note}
        </p>
      ) : null}
    </div>
  )
}
