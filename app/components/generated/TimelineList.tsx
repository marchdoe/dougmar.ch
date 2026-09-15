import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import type { TimelineEntry } from '../../content/timeline'

const revealCss = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

// Timeline year ranges arrive from content with an em dash separator;
// rendered here as an en dash, which is the allowed mark for a range.
function displayYear(year: string) {
  return year.replace(/—/g, '\u2013')
}

export function TimelineList({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Box as="section" className={css({ pb: '5' })}>
      <Box className={revealCss}>
        <Box
          className={css({
            color: 'fieldInkMuted',
            mb: '4',
            fontSize: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          Timeline
        </Box>
        <Box as="ul" className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
          {entries.map((e) => (
            <Box
              as="li"
              key={`${e.year}-${e.company}`}
              borderTop="1px solid"
              borderColor="fieldBorder"
              className={css({ py: '3', _first: { borderTop: 'none' } })}
            >
              <Box className={css({ display: 'flex', gap: '4', alignItems: 'baseline' })}>
                <span
                  className={css({
                    flex: '0 0 120px',
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 'sm',
                    color: 'accentAlt',
                  })}
                >
                  {displayYear(e.year)}
                </span>
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 'base',
                    color: 'fieldInk',
                  })}
                >
                  {e.role}, {e.company}
                </span>
              </Box>
              <p
                className={css({
                  fontSize: 'base',
                  color: 'fieldInkMuted',
                  margin: 0,
                  mt: '2',
                  ml: { base: '0', lg: '136px' },
                  maxWidth: '60ch',
                })}
              >
                {e.description}
              </p>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
