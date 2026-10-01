import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { SiteCallout } from '../components/SiteCallout'
import { Column } from '../components/generated/Column'
import { ExperimentIndex } from '../components/generated/ExperimentIndex'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <Column>
        <WorkIndex />
        <ExperimentIndex />
        <div aria-hidden="true" className={css({ height: '56px' })} />
        <SiteCallout />
      </Column>
    </>
  )
}
