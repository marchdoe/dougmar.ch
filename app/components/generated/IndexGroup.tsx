import { css } from '../../../styled-system/css'

type Row = { key: string; title: string; type: string; year: number; href: string }

export function IndexGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className={css({ '& + &': { marginTop: { base: 'clamp(28px, 3vw, 44px)', lg: '0' } } })}>
      <h3
        className={css({
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          paddingBottom: '3',
          marginBottom: '1',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        {title}
      </h3>
      {rows.map((r) => (
        <a
          key={r.key}
          href={r.href}
          className={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'baseline',
            rowGap: '2',
            columnGap: '4',
            paddingBlock: '4',
            color: 'text',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span
            className={css({
              gridColumn: '1',
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'xl',
              lineHeight: '1',
              letterSpacing: 'tight',
            })}
          >
            {r.title}
          </span>
          <span
            className={css({
              gridRow: '1 / 3',
              gridColumn: '2',
              alignSelf: 'center',
              fontFamily: 'display',
              textStyle: 'base',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {r.year}
          </span>
          <span
            className={css({
              gridColumn: '1',
              textStyle: 'xs',
              color: 'textMuted',
              letterSpacing: 'normal',
            })}
          >
            {r.type}
          </span>
        </a>
      ))}
    </div>
  )
}
