import { createFileRoute } from '@tanstack/react-router'
import { css, cx } from '../../styled-system/css'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutRail } from '../components/generated/AboutRail'
import { CapabilityStrip } from '../components/generated/CapabilityStrip'
import { revealSection } from '../components/generated/SectionHead'
import { TimelineIndex } from '../components/generated/TimelineIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <div
        className={cx(
          css({
            bg: 'bgAlt',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
            paddingBlock: 'clamp(36px, 6vh, 64px)',
            paddingInline: { base: '6vw', lg: '5vw' },
            display: { base: 'flex', lg: 'grid' },
            flexDirection: 'column',
            gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
            rowGap: { base: '48px', lg: '0' },
            columnGap: { base: '0', lg: '2vw' },
          }),
          revealSection
        )}
      >
        <div className={css({ gridColumn: { lg: '1 / 9' }, minWidth: '0' })}>
          <TimelineIndex />
          <CapabilityStrip />
        </div>
        <AboutRail />
      </div>
    </>
  )
}
