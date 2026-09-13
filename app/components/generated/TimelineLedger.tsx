import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type TimelineEntry = {
  year: string
  role: string
  company: string
  description: string
  current?: boolean
}

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const rowCss = css({
  display: 'flex',
  gap: '4',
  padding: '5 1',
  borderBottom: '1px solid',
  borderColor: 'border',
})

const yearCss = css({
  flex: 'none',
  width: { base: '86px', md: '120px' },
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'md',
  color: 'accentAlt',
})

const roleCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'lg',
  color: 'text',
})

const companyCss = css({ color: 'textMuted', fontWeight: '400' })

const descCss = css({
  marginTop: '2',
  fontSize: 'base',
  lineHeight: 'normal',
  color: 'textMuted',
  maxWidth: '68ch',
})

export function TimelineLedger({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Box as="section" padding={{ base: '24px 20px', md: '32px 7vw' }}>
      <Box className={headCss}>Career</Box>
      <Box borderTop="1px solid" borderColor="border">
        {entries.map((e) => (
          <Box key={`${e.year}-${e.company}`} className={rowCss}>
            <Box className={yearCss + ' tnum'}>{e.year}</Box>
            <Box>
              <Box className={roleCss}>
                {e.role} <span className={companyCss}>&mdash; {e.company}</span>
              </Box>
              <p className={descCss}>{e.description}</p>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
