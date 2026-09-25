import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { AboutCapabilities } from '../components/generated/AboutCapabilities'
import { AboutEducation } from '../components/generated/AboutEducation'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutStatement } from '../components/generated/AboutStatement'
import { AboutTimeline } from '../components/generated/AboutTimeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <div
      className={css({
        maxWidth: '880px',
        marginInline: 'auto',
        paddingInline: { base: '4', lg: '7' },
        paddingTop: { base: '5', lg: '7' },
        paddingBottom: { base: '7', lg: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '7', lg: '8' },
      })}
    >
      <AboutStatement />
      <AboutTimeline />
      <AboutCapabilities />
      <AboutEducation />
      <AboutPersonal />
    </div>
  )
}
