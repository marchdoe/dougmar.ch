import { css } from '../../../styled-system/css'

export const rowGrid = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  borderTop: '1px solid',
  borderColor: 'border',
  paddingBlock: '18px',
  md: {
    display: 'grid',
    gridTemplateColumns: '40px minmax(96px, 0.9fr) 2fr 6vw',
    alignItems: 'baseline',
    gap: '0',
    paddingBlock: '22px',
  },
})

export const fixedGrid = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  borderTop: '1px solid',
  borderColor: 'border',
  paddingBlock: '18px',
  md: {
    display: 'grid',
    gridTemplateColumns: '40px 180px 1fr 6vw',
    alignItems: 'baseline',
    gap: '0',
    paddingBlock: '22px',
  },
})

export const sectionPad = css({
  paddingTop: '8px',
  paddingInline: '20px',
  md: { paddingTop: '0', paddingInline: '6vw' },
})

export const metaCell = css({
  textStyle: 'sm',
  color: 'textMuted',
  letterSpacing: '0.01em',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
  md: { gridColumn: '2', gridRow: '1', textAlign: 'left', alignSelf: 'center' },
})

export const yearSpan = css({ fontWeight: 'bold', color: 'text' })

export const deck = css({
  textStyle: { base: 'base', md: 'lede' },
  color: 'textMuted',
  lineHeight: 'normal',
  maxWidth: '46ch',
  marginLeft: 'auto',
  textAlign: 'right',
})

export const visit = css({
  textStyle: 'sm',
  fontWeight: 'bold',
  color: 'accent',
  borderBottom: '1px solid',
  borderColor: 'accent',
  paddingBlock: '10px',
  display: 'inline-block',
  minHeight: '44px',
  lineHeight: '24px',
  _hover: { color: 'accentAlt', borderColor: 'accentAlt' },
})
