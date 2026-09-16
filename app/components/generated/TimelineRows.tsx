import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type TimelineEntry = (typeof timeline)[number]

export function TimelineRows({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Box
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {entries.map((entry) => (
        <div
          key={`${entry.year}-${entry.company}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '80px 1fr', md: '120px 1fr' },
            gap: '3',
            py: '5',
            borderTop: '1px solid',
            borderColor: 'border',
            alignItems: 'baseline',
          })}
        >
          <span className={css({ fontFamily: 'display', textStyle: 'md', color: 'fieldBorder' })}>
            {entry.year}
          </span>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: 'xl',
                color: 'text',
              })}
            >
              {entry.role}, {entry.company}
            </span>
            <span className={css({ textStyle: 'md', color: 'textMuted', maxW: '68ch' })}>
              {entry.description}
            </span>
          </div>
        </div>
      ))}
    </Box>
  )
}
