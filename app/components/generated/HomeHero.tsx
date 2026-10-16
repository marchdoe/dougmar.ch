import { featuredProject } from '../../content/projects'
import { EvidencePanel } from './EvidencePanel'
import { HomeThesis } from './HomeThesis'
import { SplitHero } from './Panels'

export function HomeHero() {
  return (
    <SplitHero>
      <HomeThesis />
      {featuredProject ? <EvidencePanel project={featuredProject} /> : null}
    </SplitHero>
  )
}
