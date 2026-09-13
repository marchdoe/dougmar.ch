import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const bodyCss = css({ fontSize: 'base', lineHeight: 'normal', color: 'text', maxWidth: '68ch' })

const listCss = css({
  marginTop: '4',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  listStyle: 'none',
  padding: 0,
})

const itemCss = css({
  fontSize: 'sm',
  color: 'textMuted',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'md',
  padding: '2 3',
})

export function WhitePaperContext({
  context,
  constraints,
}: {
  context?: string
  constraints?: string[]
}) {
  if (!context && !constraints) return null
  return (
    <Box as="section" padding={{ base: '24px 20px', md: '0 7vw 48px' }}>
      <Box className={headCss}>Context</Box>
      {context && <p className={bodyCss}>{context}</p>}
      {constraints && (
        <ul className={listCss}>
          {constraints.map((c) => (
            <li key={c} className={itemCss}>
              {c}
            </li>
          ))}
        </ul>
      )}
    </Box>
  )
}
