import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { featuredProject, selectedWork, experiments } from '../content/projects'
import { SiteCallout } from '../components/SiteCallout'
import { ClauseHero } from '../components/generated/ClauseHero'
import { WorkIndexCard } from '../components/generated/WorkIndexCard'
import { LedgerCard } from '../components/generated/LedgerCard'
import { ClauseField } from '../components/generated/ClauseField'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <ClauseHero />
      <section
        className={css({
          bg: 'bg',
          paddingInline: '6vw',
          paddingBlock: '9',
          display: 'flex',
          flexDirection: 'column',
          gap: '7',
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
          md: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '8',
            rowGap: '0',
            alignItems: 'start',
          },
        })}
      >
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '2xl',
            lineHeight: 'snug',
            color: 'textMuted',
            textAlign: 'right',
            maxWidth: '22ch',
            marginLeft: 'auto',
            md: { gridColumn: '1 / -1' },
          })}
        >
          The work, bracketed by the promise made before it and the promise kept after it.
        </p>
        <div className={css({ md: { gridColumn: '1 / 2' } })}>
          <WorkIndexCard
            featured={featuredProject}
            selected={selectedWork}
            experiments={experiments}
          />
        </div>
        <div className={css({ md: { gridColumn: '2 / 3' } })}>
          <LedgerCard />
        </div>
      </section>
      <SiteCallout />
      <ClauseField />
    </>
  )
}
