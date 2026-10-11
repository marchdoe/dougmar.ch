import type { projects } from '../../content/projects'
import { EvidencePanel } from './EvidencePanel'
import { HeroShell } from './HeroShell'
import { HomeLead } from './HomeLead'
import { textField } from './projectFields'

type Project = (typeof projects)[number]

const FALLBACK =
  'Spaceman is the studio I have run on my own for ten years. Product design, frontend engineering, design systems and brand for the clients beside this line.'

function standfirstFor(project: Project | undefined): string {
  if (!project) return FALLBACK
  return textField(project, 'problem') || textField(project, 'description') || FALLBACK
}

export function HomeHero({ project }: { project: Project | undefined }) {
  return (
    <HeroShell
      tall
      lead={
        <HomeLead
          title={project ? project.title : 'Spaceman'}
          standfirst={standfirstFor(project)}
        />
      }
      aside={project ? <EvidencePanel project={project} /> : null}
    />
  )
}
