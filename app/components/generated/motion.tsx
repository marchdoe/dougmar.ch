import { css } from '../../../styled-system/css'

// Scroll reveal for every section below a hero. Hidden state lives only inside @supports.
export const revealOnScroll = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})
