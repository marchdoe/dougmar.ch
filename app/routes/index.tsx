import { createFileRoute } from '@tanstack/react-router'
import { featuredProject, selectedWork, experiments } from '../content/projects'
import { HeroHome } from '../components/generated/HeroHome'
import { FeaturedBand } from '../components/generated/FeaturedBand'
import { SectionHead } from '../components/generated/SectionHead'
import { IndexRows } from '../components/generated/IndexRows'
import { SubheadDivider } from '../components/generated/SubheadDivider'
import { SignalsBand } from '../components/generated/SignalsBand'
import { Box } from '../../styled-system/jsx'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const workItems = selectedWork.map((project, index) => ({
    num: String(index + 1).padStart(2, '0'),
    title: project.title,
    meta: [project.type, String(project.year)],
    href: `/work/${project.slug}`,
    linkLabel: 'View',
  }))

  const experimentItems = experiments.map((project, index) => ({
    num: String(selectedWork.length + index + 1).padStart(2, '0'),
    title: project.title,
    meta: [project.type, String(project.year)],
    href: project.externalUrl ?? `/work/${project.slug}`,
    linkLabel: project.externalUrl ? 'Visit' : 'View',
  }))

  return (
    <>
      <HeroHome />
      <Box as="main" pt={{ base: '10', md: '14' }}>
        {featuredProject && (
          <FeaturedBand
            tag={`Featured \u00b7 ${featuredProject.type} \u00b7 ${featuredProject.year}`}
            title={featuredProject.title}
            problem={featuredProject.problem ?? featuredProject.description ?? ''}
            linkHref={featuredProject.externalUrl ?? featuredProject.liveUrl}
            linkLabel={`Open ${featuredProject.title}`}
          />
        )}

        <SectionHead eyebrow="02 . selected work" heading="the work" />
        <Box px={{ base: '4', md: '6', lg: '96px' }}>
          <IndexRows items={workItems} />
        </Box>

        <SubheadDivider label="experiments, off the clock" />
        <Box px={{ base: '4', md: '6', lg: '96px' }} pb={{ base: '10', md: '14' }}>
          <IndexRows items={experimentItems} />
        </Box>

        <SignalsBand
          caption="signals, Sept 16, 2026"
          rows={[
            { k: 'Tigers, final', v: 'Detroit 10\u20131' },
            { k: 'SPY', v: '757.39, down 0.46%' },
            { k: 'Weather', v: 'Clear 58F, SSW 4mph' },
            { k: 'Moon', v: 'Waxing crescent, 28%' },
            { k: 'Golf', v: 'Biltmore Championship, scheduled' },
            { k: 'Air quality', v: 'AQI good' },
            { k: 'On rotation', v: 'Wet Leg, My Morning Jacket, Radiohead' },
            { k: 'Location', v: 'Detroit' },
          ]}
        />
      </Box>
    </>
  )
}
