import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const rowCss = css({ borderBottom: '1px solid', borderColor: 'border', padding: '4 0' })
const linkCss = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  fontFamily: 'display',
  color: 'accent',
  _hover: { color: 'accentAlt' },
})
const noteCss = css({ fontSize: 'base', color: 'textMuted', marginTop: '1', maxWidth: '64ch' })

export function WhitePaperReferences({ references }: { references?: Reference[] }) {
  if (!references || references.length === 0) return null
  return (
    <Box as="section" padding={{ base: '24px 20px', md: '0 7vw 56px' }}>
      <Box className={headCss}>References</Box>
      {references.map((r) => (
        <Box key={r.url} className={rowCss}>
          <a href={r.url} className={linkCss}>
            {r.title}
          </a>
          {r.note && <p className={noteCss}>{r.note}</p>}
        </Box>
      ))}
    </Box>
  )
}
