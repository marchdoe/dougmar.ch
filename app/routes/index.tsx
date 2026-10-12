import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <WorkIndex />
      <div
        className={css({
          marginTop: '48px',
          marginInline: { base: '-16px', md: '-32px', lg: '-6vw', xl: '-7vw' },
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        })}
      >
        <SiteCallout />
      </div>
    </>
  )
}
