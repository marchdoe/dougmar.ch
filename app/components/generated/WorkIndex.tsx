import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function WorkIndex({ label, items }: { label: string; items: Project[] }) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column' })}>
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'textFaint',
          paddingTop: '24px',
          paddingInline: '4px',
          paddingBottom: '6px',
        })}
      >
        {label}
      </div>
      {items.map((p) => (
        <a
          key={p.slug}
          href={`/work/${p.slug}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'baseline',
            gap: '14px',
            paddingBlock: '16px',
            paddingInline: '4px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
            color: 'text',
            minHeight: '44px',
            borderRadius: 'sm',
            transition: 'background 120ms ease, color 120ms ease',
            _hover: { bg: 'surface', color: 'accentAlt' },
          })}
        >
          <span
            className={css({
              fontFamily: 'display',
              fontSize: 'clamp(26px, 3.4vw, 40px)',
              lineHeight: '1',
              letterSpacing: '.02em',
              minWidth: '0',
            })}
          >
            {p.title}
          </span>
          <span
            className={css({
              fontSize: 'xs',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'textMuted',
              textAlign: 'right',
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {p.type} · {p.year}
          </span>
        </a>
      ))}
    </div>
  )
}
