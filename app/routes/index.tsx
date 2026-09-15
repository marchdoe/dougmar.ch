import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { HeroField } from '../components/generated/HeroField'
import { EvidenceRail } from '../components/generated/EvidenceRail'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <Box
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0,1.7fr) minmax(320px,0.9fr)' },
      })}
    >
      <HeroField />
      <EvidenceRail />
    </Box>
  )
}
