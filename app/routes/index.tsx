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
      <div aria-hidden="true" className={css({ height: 'clamp(24px, 3vw, 48px)' })} />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
