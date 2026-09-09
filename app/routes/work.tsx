import { createFileRoute } from '@tanstack/react-router'
import { featuredProject, selectedWork, experiments } from '../content/projects'
import { IndexRow } from '../components/generated/IndexRow'
import { Colophon } from '../components/generated/Colophon'
import { Box } from '../../styled-system/jsx'

export const Route = createFileRoute('/work')({ component: WorkIndexPage })

function WorkIndexPage() {
  const total = selectedWork.length + experiments.length + (featuredProject ? 1 : 0)
  return (
    <>
      <Box
        as="main"
        paddingInline={{ base: '20px', md: '6', lg: '8' }}
        paddingBlock={{ base: '9', md: '9' }}
        display="flex"
        flexDirection="column"
      >
        {featuredProject && (
          <IndexRow
            tall
            year={String(featuredProject.year)}
            title={featuredProject.title}
            description={featuredProject.problem}
            href={featuredProject.externalUrl ?? `/work/${featuredProject.slug}`}
            hrefLabel="visit →"
          />
        )}
        {selectedWork.map((p) => (
          <IndexRow
            key={p.slug}
            year={String(p.year)}
            title={p.title}
            subtitle={p.type}
            href={`/work/${p.slug}`}
            hrefLabel="read →"
          />
        ))}
        {experiments.map((p) => (
          <IndexRow
            key={p.slug}
            year={String(p.year)}
            title={p.title}
            subtitle={p.type}
            href={p.externalUrl ?? `/work/${p.slug}`}
            hrefLabel="view →"
          />
        ))}
      </Box>
      <Colophon signals={[{ label: 'Selected work', value: `${total} projects` }]} />
    </>
  )
}
