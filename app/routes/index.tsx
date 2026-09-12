import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Grid } from '../../styled-system/jsx'
import { HeroQuote } from '../components/generated/HeroQuote'
import { FeaturedProject } from '../components/generated/FeaturedProject'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroQuote />
      <Grid
        className={css({
          bg: 'bg',
          borderTop: '1px solid',
          borderColor: 'border',
          paddingInline: { base: '5', lg: '9' },
          paddingBlock: { base: '8', lg: '9' },
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
          gap: { base: '8', md: '9' },
        })}
      >
        <FeaturedProject />
        <WorkIndex />
      </Grid>
    </>
  )
}
