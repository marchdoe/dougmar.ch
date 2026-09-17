import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Entry = { year: string; role: string; company: string; description: string; current?: boolean }

function formatYear(year: string) {
  const trimmed = year.trim()
  if (/—\s*$/.test(trimmed)) {
    return trimmed.replace(/—\s*$/, '–present')
  }
  return trimmed.replace(/—/g, '–')
}

export function Timeline({ entries }: { entries: Entry[] }) {
  return (
    <Box
      as="section"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '40px', md: '56px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: '600',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
          display: 'block',
          marginBottom: '5',
        })}
      >
        Timeline
      </span>
      {entries.map((e) => (
        <Box
          key={`${e.year}-${e.company}`}
          className={css({
            display: 'flex',
            gap: '5',
            borderTop: '1px solid',
            borderColor: 'border',
            paddingBlock: '4',
            alignItems: 'baseline',
            flexWrap: 'wrap',
          })}
        >
          <Box
            fontFamily="display"
            color={e.current ? 'accent' : 'textMuted'}
            className={css({
              fontSize: 'sm',
              minWidth: '120px',
              flexShrink: '0',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {formatYear(e.year)}
          </Box>
          <Box className={css({ flex: '1', minWidth: '200px' })}>
            <Box fontFamily="body" color="text" className={css({ fontSize: 'md' })}>
              {e.role}, {e.company}
            </Box>
            <Box
              as="p"
              color="textMuted"
              className={css({ fontSize: 'base', marginTop: '2', maxWidth: '66ch' })}
            >
              {e.description}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
