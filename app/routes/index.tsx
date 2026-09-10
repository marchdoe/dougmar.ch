import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { Hero } from '../components/generated/Hero'
import { FeaturedProject } from '../components/generated/FeaturedProject'
import { ProjectRows } from '../components/generated/ProjectRows'
import { featuredProject, selectedWork, experiments } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <Box
      as="section"
      id="top"
      className={css({
        bg: 'bg',
        color: 'text',
        paddingX: { base: '5', lg: '6vw' },
        paddingTop: { base: '8', lg: '9' },
        paddingBottom: { base: '9', lg: '9' },
        minHeight: { base: '70vh', lg: '92vh' },
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        maxWidth: '100%',
      })}
    >
      <Hero />

      <Box
        className={css({ borderTop: '1px solid', borderColor: 'borderStrong', marginTop: '9' })}
      />

      <Box id="work" className={css({ marginTop: '9' })}>
        {featuredProject && (
          <>
            <p
              className={css({
                textStyle: 'base',
                fontWeight: '700',
                fontVariant: 'small-caps',
                letterSpacing: 'widest',
                color: 'textMuted',
                marginBottom: '5',
              })}
            >
              Featured
            </p>
            <FeaturedProject project={featuredProject} />
          </>
        )}

        <ProjectRows label="Selected work" items={selectedWork} />
        <ProjectRows label="Experiments" items={experiments} marginTop="9" />
      </Box>
    </Box>
  )
}
