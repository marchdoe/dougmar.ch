import { css } from '../../../styled-system/css'

// Scroll reveal for every section below the hero. It only runs where
// scroll-driven animations exist, so without them the page is fully formed.
export const reveal = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})
