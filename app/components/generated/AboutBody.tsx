import { css } from '../../../styled-system/css'
import { AboutAside } from './AboutAside'
import { TimelineList } from './TimelineList'

export function AboutBody() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '2fr 1fr' },
        columnGap: 'clamp(26px, 3vw, 44px)',
        rowGap: '6',
        paddingTop: '6',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <TimelineList />
      <AboutAside />
    </div>
  )
}
