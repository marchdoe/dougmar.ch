import type { projects } from '../../content/projects'
import { BuildSection } from './BuildSection'
import { KeyValueList } from './KeyValueList'
import { LedgerSection } from './LedgerSection'
import { ProseBlocks } from './ProseBlocks'

type Project = (typeof projects)[number]
type Extended = Project & { timeline?: string; status?: string }

export function CaseStudy({ project }: { project: Project }) {
  const extra = project as Extended
  const record = [
    { k: 'Year', v: String(project.year) },
    { k: 'Type', v: project.type },
    { k: 'Role', v: project.role ?? '' },
    { k: 'Timeline', v: String(extra.timeline ?? '') },
    { k: 'Status', v: String(extra.status ?? '') },
  ].filter((row) => row.v)
  const narrative = [
    { k: 'Summary', v: project.description ?? '' },
    { k: 'Problem', v: project.problem ?? '' },
    { k: 'Approach', v: project.approach ?? '' },
    { k: 'Outcome', v: project.outcome ?? '' },
  ].filter((block) => block.v)
  return (
    <>
      <LedgerSection label="Record" aside={String(project.year)}>
        <KeyValueList rows={record} />
      </LedgerSection>
      <LedgerSection label="Narrative" aside="Problem, approach, outcome">
        <ProseBlocks blocks={narrative} />
      </LedgerSection>
      <BuildSection stack={project.stack ?? []} liveUrl={project.liveUrl} />
    </>
  )
}
