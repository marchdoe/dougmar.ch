import { styled } from '../../../styled-system/jsx'

export const RevealSection = styled('section', {
  base: {
    '@supports (animation-timeline: view())': {
      animationName: 'rise',
      animationTimeline: 'view()',
      animationRange: 'entry 0% entry 40%',
      animationFillMode: 'both',
    },
  },
})
