import { css } from '../../../styled-system/css'

export const revealClass = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

export const microClass = css({
  fontFamily: 'body',
  fontSize: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'text',
  marginBottom: '3',
})

export const extLinkClass = css({
  display: 'inline-block',
  marginTop: '14px',
  paddingBlock: '6px',
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'text',
  lineHeight: '32px',
  minHeight: '44px',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
  _hover: { color: 'accentAlt', textDecoration: 'none' },
})

export const sectionPadClass = css({
  paddingInline: { base: '20px', lg: '6vw' },
  paddingBlock: { base: '6', lg: '7' },
})
