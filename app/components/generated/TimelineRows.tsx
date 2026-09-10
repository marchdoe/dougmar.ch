import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Entry = {
  year: string
  role: string
  company: string
  description: string
  current?: boolean
}

export function TimelineRows({ entries }: { entries: Entry[] }) {
  return (
    <Box className={css({ borderTop: '1px solid', borderColor: 'borderStrong' })}>
      {entries.map((entry) => (
        <Box
          key={`${entry.year}-${entry.company}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '80px 1fr', lg: '120px 1fr' },
            columnGap: '5',
            rowGap: '2',
            paddingY: { base: '4', lg: '5' },
            borderBottom: '1px solid',
            borderColor: 'border',
          })}
        >
          <span
            className={css({
              textStyle: '2xs',
              fontWeight: '700',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: entry.current ? 'accent' : 'textMuted',
            })}
          >
            {entry.year}
          </span>
          <Box>
            <p className={css({ textStyle: 'base', fontWeight: '600', color: 'text' })}>
              {entry.role} · {entry.company}
            </p>
            <p
              className={css({
                textStyle: 'sm',
                lineHeight: 'normal',
                color: 'textMuted',
                marginTop: '2',
                maxWidth: '60ch',
              })}
            >
              {entry.description}
            </p>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
