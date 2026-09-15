import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutLedger } from '../components/generated/AboutLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <Box
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'minmax(0,1.7fr) minmax(320px,0.9fr)' },
      })}
    >
      <AboutHero />
      <AboutLedger />
    </Box>
  )
}
