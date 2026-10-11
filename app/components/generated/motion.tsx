import { css } from '../../../styled-system/css'

// Entrance: wipe. One gesture on the hero, staggered from the fixed set.
export const wipeFirst = css({
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export const wipeSecond = css({
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

export const wipeThird = css({
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

export const wipeFourth = css({
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '240ms',
})

// Reveal: on-scroll, only where scroll-driven animation exists.
export const riseOnScroll = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})
