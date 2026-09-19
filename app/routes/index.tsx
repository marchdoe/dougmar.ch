import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Hero } from '../components/generated/Hero'
import { BodyGrid } from '../components/generated/BodyGrid'
import { DesignedPanel, BuiltPanel } from '../components/generated/Panel'
import { FeaturedProject } from '../components/generated/FeaturedProject'
import { WorkList } from '../components/generated/WorkList'
import { ExperimentsList } from '../components/generated/ExperimentsList'
import { Leaderboard } from '../components/generated/Leaderboard'
import { ClosingLine } from '../components/generated/ClosingLine'
import { featuredProject, selectedWork, experiments } from '../content/projects'
import { identity } from '../content/about'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const workHref = selectedWork[0]
    ? `/work/${selectedWork[0].slug}`
    : featuredProject
      ? `/work/${featuredProject.slug}`
      : '/'

  return (
    <>
      <Hero
        word="GAP"
        eyebrow="Doug March. Type specimen."
        deck={
          <>
            Closing the gap between what gets{' '}
            <b className={css({ color: 'accentAlt', fontWeight: 'bold' })}>designed</b> and what
            gets <b className={css({ color: 'accentAlt', fontWeight: 'bold' })}>built</b>.
          </>
        }
      />
      <BodyGrid
        left={
          <DesignedPanel note="what the work looks like">
            {featuredProject && (
              <FeaturedProject
                slug={featuredProject.slug}
                title={featuredProject.title}
                role={featuredProject.role}
                year={featuredProject.year}
                problem={featuredProject.problem}
                description={featuredProject.description}
                externalUrl={featuredProject.externalUrl}
                liveUrl={featuredProject.liveUrl}
              />
            )}
            <WorkList items={selectedWork} />
          </DesignedPanel>
        }
        right={
          <BuiltPanel note="what actually ships">
            <Leaderboard />
            <ExperimentsList items={experiments} />
            <ClosingLine
              firstHref={workHref}
              firstLabel="the work"
              secondHref="/about"
              secondLabel="about"
              email={identity.email}
            />
          </BuiltPanel>
        }
      />
    </>
  )
}
