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
      <div className={css({ gridArea: 'rest', minWidth: '0' })}>
        <WorkIndex />
        <SiteCallout />
      </div>
    </>
  )
}
