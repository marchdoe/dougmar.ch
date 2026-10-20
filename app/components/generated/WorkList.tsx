import { css } from '../../../styled-system/css'

type Item = { slug: string; title: string; type: string; year: number; href: string }

export function WorkList({ label, items }: { label: string; items: Item[] }) {
  return (
    <div>
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '13px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginBottom: '6px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '12px',
        })}
      >
        {label}
      </div>
      {items.map((item) => (
        <a
          key={item.slug}
          href={item.href}
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            paddingBlock: '18px',
            minHeight: '56px',
            color: 'text',
            textDecoration: 'none',
            _hover: { textDecoration: 'none', color: 'text' },
          })}
        >
          <span
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              letterSpacing: '0.01em',
              fontSize: 'clamp(20px, 2vw, 28px)',
              color: 'text',
              flex: '1',
              minWidth: '0',
            })}
          >
            {item.title}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontSize: '13px',
              color: 'textMuted',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            })}
          >
            {item.type} · {item.year}
          </span>
          <span
            aria-hidden="true"
            className={css({ fontFamily: 'display', color: 'accent', fontSize: '18px' })}
          >
            →
          </span>
        </a>
      ))}
    </div>
  )
}
