import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { AboutDossier } from '../components/generated/AboutDossier'
import { AboutStatement } from '../components/generated/AboutStatement'
import { PersonalRail } from '../components/generated/PersonalRail'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <div
      className={css({
        display: { base: 'block', lg: 'grid' },
        minHeight: { lg: '88vh' },
        gridTemplateColumns: { lg: 'minmax(0, 1fr) minmax(0, 1.4fr)' },
        columnGap: { lg: '6vw' },
        gridTemplateAreas: { lg: '"dossier statement" "personal statement"' },
      })}
    >
      <AboutStatement />
      <AboutDossier />
      <PersonalRail />
    </div>
  )
}
