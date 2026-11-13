import { css } from '../../../styled-system/css'

export const grid = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: 'repeat(4, 1fr)' },
  gridAutoRows: { md: 'minmax(150px, auto)' },
  gap: '2px',
  bg: 'border',
  borderBlockWidth: '2px',
  borderInlineWidth: '0',
  borderStyle: 'solid',
  borderColor: 'border',
})

export const stackGrid = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '2px',
  bg: 'border',
  borderBlockWidth: '2px',
  borderInlineWidth: '0',
  borderStyle: 'solid',
  borderColor: 'border',
})

export const tile = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '4',
  minHeight: '150px',
  minWidth: '0',
  paddingTop: '22px',
  paddingInline: '22px',
  paddingBottom: '24px',
})

export const label = css({
  fontFamily: 'body',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  fontSize: 'xs',
  lineHeight: '1.3',
})

export const whead = css({
  gridColumn: '1 / -1',
  bg: 'bg',
  paddingBlock: '20px',
  paddingInline: '22px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
})

export const wheadTitle = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontVariant: 'small-caps',
  fontSize: 'clamp(22px, 3vw, 30px)',
  lineHeight: '1.1',
  color: 'text',
})

export const reveal = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})
