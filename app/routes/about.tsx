import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineRows } from '../components/generated/TimelineRows'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { PersonalStats } from '../components/generated/PersonalStats'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <section
        className={css({
          bg: 'bg',
          paddingInline: { base: '6vw', lg: '5vw' },
          paddingBlock: '9',
        })}
      >
        <TimelineRows />
      </section>
      <section
        className={css({
          bg: 'bg',
          paddingInline: { base: '6vw', lg: '5vw' },
          paddingBlock: '7',
        })}
      >
        <CapabilityTags />
      </section>
      <PersonalStats />
    </>
  )
}
