import { css } from '../../../styled-system/css'

type Item = { slug: string; title: string; type: string; year: number; href: string }

export function IndexBlock({
  heading,
  count,
  items,
}: {
  heading: string
  count: string
  items: Item[]
}) {
  return (
    <div className={css({ '& + &': { marginTop: 'clamp(48px, 7vw, 112px)' } })}>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: '600',
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            letterSpacing: '-0.01em',
            textTransform: 'lowercase',
          })}
        >
          {heading}
        </h2>
        <span
          className={css({
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {count}
        </span>
      </div>
      {items.map((item) => (
        <a
          key={item.slug}
          href={item.href}
          className={css({
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto auto',
            alignItems: 'baseline',
            gap: '16px',
            paddingBlock: 'clamp(16px, 2vw, 22px)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            transition: 'padding-left 0.2s ease',
            _hover: { paddingLeft: '10px' },
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: '600',
              fontSize: 'clamp(22px, 3vw, 34px)',
              letterSpacing: '-0.02em',
              lineHeight: '1.05',
              color: 'text',
              textTransform: 'lowercase',
              transition: 'color 0.2s ease',
              'a:hover &': { color: 'accent' },
            })}
          >
            {item.title}
          </span>
          <span
            className={css({
              fontSize: '13px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'textMuted',
              justifySelf: 'end',
            })}
          >
            {item.type}
          </span>
          <span
            className={css({
              fontSize: '14px',
              fontVariantNumeric: 'tabular-nums',
              color: 'textFaint',
              justifySelf: 'end',
              minWidth: '3.4ch',
              textAlign: 'right',
            })}
          >
            {item.year}
          </span>
        </a>
      ))}
    </div>
  )
}
