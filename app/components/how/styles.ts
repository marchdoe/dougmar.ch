import { css } from '../../../styled-system/css'

/**
 * Classes the explainer's parts share. Each is a `css()` call at module scope
 * with a literal argument, because Panda extracts styles statically: a value
 * computed at render time emits a class name with no rule behind it. Colors
 * that arrive at render time go through a CSS custom property that a static
 * class reads.
 */

export const back = css({
  fontSize: 'archive.micro',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'archive.dim',
  textDecoration: 'none',
  display: 'inline-block',
  marginBottom: '20px',
  _hover: { color: 'archive.text' },
})

export const absent = css({
  fontSize: 'archive.small',
  color: 'archive.faint',
  fontStyle: 'italic',
  maxWidth: '60ch',
  lineHeight: '1.6',
})

export const prose = css({
  fontFamily: 'archive.sans',
  fontSize: 'archive.body',
  lineHeight: '1.75',
  color: 'archive.text',
  maxWidth: '68ch',
  whiteSpace: 'pre-wrap',
})

export const subhead = css({
  fontSize: 'archive.micro',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'archive.dim',
  marginTop: '26px',
  marginBottom: '10px',
})

export const defList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '72ch',
})

export const defRow = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', sm: '132px minmax(0, 1fr)' },
  gap: { base: '2px', sm: '16px' },
  alignItems: 'baseline',
  paddingBottom: '10px',
  borderBottom: '1px solid',
  borderColor: 'archive.lineSoft',
})

export const defKey = css({
  fontSize: 'archive.micro',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'archive.dim',
})

export const defValue = css({ fontSize: 'archive.small', color: 'archive.text', minWidth: 0 })

export const defEmpty = css({
  fontSize: 'archive.small',
  color: 'archive.faint',
  fontStyle: 'italic',
})
