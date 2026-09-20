import { css } from '../../../styled-system/css'

/**
 * Classes the explainer's parts share. Each is a `css()` call at module scope
 * with a literal argument, because Panda extracts styles statically: a value
 * computed at render time emits a class name with no rule behind it. Colors
 * that arrive at render time go through a CSS custom property that a static
 * class reads.
 */

export const back = css({
  fontSize: 'archive.label',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'archive.dim',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginBottom: '6px',
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
  maxWidth: '52ch',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
})

export const subhead = css({
  fontSize: 'archive.label',
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
  fontSize: 'archive.label',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'archive.dim',
})

// Raw so a caller that adds to it can merge with `css(defValueStyle, extra)`.
// Two `css()` results that set the same property do not merge: each is a list
// of atomic classes and the stylesheet order picks the winner.
export const defValueStyle = css.raw({
  fontSize: 'archive.small',
  color: 'archive.text',
  minWidth: 0,
})

export const defValue = css(defValueStyle)

export const defEmpty = css({
  fontSize: 'archive.small',
  color: 'archive.faint',
  fontStyle: 'italic',
})
