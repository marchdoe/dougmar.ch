import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { featuredProject, selectedWork, experiments } from '../../content/projects'
import { FeaturedProject } from './FeaturedProject'
import { WorkIndexList } from './WorkIndexList'
import { SignalsPanel } from './SignalsPanel'

export function EvidenceRail() {
  const workItems = selectedWork.map((p) => ({
    key: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: `/work/${p.slug}`,
  }))
  const experimentItems = experiments.map((p) => ({
    key: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: p.externalUrl || `/work/${p.slug}`,
  }))

  return (
    <Box
      as="aside"
      id="work"
      bg="field"
      color="fieldInk"
      minWidth="0px"
      className={css({
        position: 'relative',
        padding: { base: '32px 6vw 44px', lg: '40px 3vw 56px', xl: '52px 40px 64px' },
      })}
    >
      {featuredProject && <FeaturedProject project={featuredProject} />}
      <WorkIndexList
        label="Selected Work"
        count={String(workItems.length).padStart(2, '0')}
        items={workItems}
      />
      <WorkIndexList
        label="Experiments"
        count={String(experimentItems.length).padStart(2, '0')}
        items={experimentItems}
      />
      <SignalsPanel />
    </Box>
  )
}
