import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { SiteCallout } from '../components/SiteCallout'
import { HomeArtifact } from '../components/generated/HomeArtifact'
import { HomeClients } from '../components/generated/HomeClients'
import { SignalRail } from '../components/generated/SignalRail'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div
      className={css({
        display: { base: 'block', lg: 'grid' },
        minHeight: { lg: '88vh' },
        gridTemplateColumns: { lg: 'minmax(0, 1fr) minmax(0, 1.4fr)' },
        columnGap: { lg: '6vw' },
        gridTemplateAreas: {
          lg: '"index artifact" "signals artifact" "clients artifact" "callout callout"',
        },
        alignContent: { lg: 'stretch' },
      })}
    >
      <HomeArtifact />
      <WorkIndex />
      <div className={css({ gridArea: { lg: 'callout' } })}>
        <SiteCallout />
      </div>
      <SignalRail />
      <HomeClients />
    </div>
  )
}
