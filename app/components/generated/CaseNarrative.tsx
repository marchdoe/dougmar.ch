import { css } from '../../../styled-system/css'

type Row = { label: string; body?: string }

export function CaseNarrative({ rows }: { rows: Row[] }) {
  const present = rows.filter((row) => Boolean(row.body))
  if (present.length === 0) return null
  return (
    <section
      aria-label="Case study"
      className={css({
        paddingInline: '5vw',
        paddingBlock: 'clamp(20px, 3vw, 40px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {present.map((row) => (
        <div
          key={row.label}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '150px minmax(0, 1fr)' },
            alignItems: 'baseline',
            columnGap: 'clamp(14px, 2.4vw, 40px)',
            rowGap: '8px',
            paddingBlock: 'clamp(18px, 2.4vw, 32px)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'border',
          })}
        >
          {/* accent fails 4.5:1 at label size on the light ground, so the label takes text on a flat bg */}
          <span
            className={css({
              justifySelf: 'start',
              width: 'fit-content',
              bg: 'bg',
              fontSize: '18px',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontWeight: 'bold',
              color: 'text',
            })}
          >
            {row.label}
          </span>
          <p
            className={css({
              textStyle: 'lede',
              lineHeight: '1.55',
              color: 'text',
              maxWidth: '50ch',
              justifySelf: { base: 'start', md: 'end' },
            })}
          >
            {row.body}
          </p>
        </div>
      ))}
    </section>
  )
}
