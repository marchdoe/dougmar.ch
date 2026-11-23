import { css } from '../../../styled-system/css'

export const band = css({
  paddingBlock: 'clamp(48px, 7vw, 112px)',
  paddingInline: 'clamp(24px, 5vw, 72px)',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
})

export const reveal = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

export const cell = css({
  bg: 'surface',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: 'sm',
  padding: 'clamp(18px, 2vw, 28px)',
  minWidth: '0',
})

export const label = css({
  display: 'block',
  textStyle: '2xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
  marginBottom: '4',
})
