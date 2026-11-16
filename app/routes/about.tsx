import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <div className={css({ gridArea: 'rest', minWidth: '0' })}>
        <TimelineSection />
        <AboutFacts />
      </div>
    </>
  )
}
