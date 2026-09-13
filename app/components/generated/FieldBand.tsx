import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

const eyebrowCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'fieldInkMuted',
  marginBottom: '3',
})

const titleCss = css({
  fontFamily: 'display',
  fontWeight: '900',
  fontSize: { base: '3xl', lg: '4xl' },
  textTransform: 'uppercase',
  color: 'fieldInk',
  lineHeight: 'tight',
  maxWidth: '100%',
  overflowWrap: 'break-word',
})

const standfirstCss = css({
  fontFamily: 'body',
  fontSize: 'lg',
  lineHeight: 'normal',
  color: 'fieldInkMuted',
  maxWidth: '66ch',
  marginTop: '5',
})

export function FieldBand({
  eyebrow,
  title,
  standfirst,
}: {
  eyebrow?: string
  title: string
  standfirst?: string
}) {
  return (
    <Box
      as="section"
      bg="field"
      borderTop="2px solid"
      borderBottom="2px solid"
      borderColor="fieldBorder"
      padding={{ base: '32px 20px', md: '48px 7vw', lg: '64px 7vw' }}
    >
      {eyebrow && <Box className={eyebrowCss}>{eyebrow}</Box>}
      <h1 className={titleCss}>{title}</h1>
      {standfirst && <p className={standfirstCss}>{standfirst}</p>}
    </Box>
  )
}
