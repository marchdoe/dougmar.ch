import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type ProcessStep = { phase: string; does: string; produces: string }

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const listCss = css({
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '5',
})

const itemCss = css({
  display: 'flex',
  gap: '4',
  alignItems: 'baseline',
  borderBottom: '1px solid',
  borderColor: 'border',
  paddingBottom: '4',
})

const numCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'md',
  color: 'accentAlt',
  flex: 'none',
})
const phaseCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'lg',
  color: 'text',
  flex: 'none',
  width: { base: '100%', md: '160px' },
})
const doesCss = css({ fontSize: 'base', color: 'textMuted', flex: '1' })
const producesCss = css({ fontSize: 'sm', color: 'textFaint', marginTop: '1' })

export function WhitePaperProcess({ process }: { process?: ProcessStep[] }) {
  if (!process || process.length === 0) return null
  return (
    <Box as="section" padding={{ base: '24px 20px', md: '0 7vw 48px' }}>
      <Box className={headCss}>Process</Box>
      <ol className={listCss}>
        {process.map((step, i) => (
          <li key={step.phase} className={itemCss}>
            <span className={numCss}>{String(i + 1).padStart(2, '0')}</span>
            <Box flex="1">
              <span className={phaseCss}>{step.phase}</span>
              <p className={doesCss}>{step.does}</p>
              <p className={producesCss}>&rarr; {step.produces}</p>
            </Box>
          </li>
        ))}
      </ol>
    </Box>
  )
}
