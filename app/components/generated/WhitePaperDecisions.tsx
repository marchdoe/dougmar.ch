import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Decision = { decision: string; why: string }

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const rowCss = css({ borderBottom: '1px solid', borderColor: 'border', padding: '4 0' })
const decisionCss = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  fontFamily: 'display',
  color: 'text',
})
const whyCss = css({ fontSize: 'base', color: 'textMuted', marginTop: '1', maxWidth: '64ch' })

export function WhitePaperDecisions({ decisions }: { decisions?: Decision[] }) {
  if (!decisions || decisions.length === 0) return null
  return (
    <Box as="section" padding={{ base: '24px 20px', md: '0 7vw 48px' }}>
      <Box className={headCss}>Decisions</Box>
      {decisions.map((d) => (
        <Box key={d.decision} className={rowCss}>
          <p className={decisionCss}>{d.decision}</p>
          <p className={whyCss}>{d.why}</p>
        </Box>
      ))}
    </Box>
  )
}
