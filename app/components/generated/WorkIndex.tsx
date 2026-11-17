import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { RuledList } from './RuledList'
import { SectionHead } from './SectionHead'
import { WorkRow } from './WorkRow'

const ordered = [...projects].sort((a, b) => b.year - a.year)

function spanLabel(): string {
  const years = projects.map((p) => p.year)
  return `${Math.min(...years)}–${Math.max(...years)} · ${projects.length} entries`
}

export function WorkIndex() {
  return (
    <div id="work" className={css({ minWidth: '0' })}>
      <SectionHead label="Selected Work" aside={spanLabel()} />
      <RuledList>
        {ordered.map((p, i) => (
          <WorkRow key={p.slug} project={p} lead={i === 0} />
        ))}
      </RuledList>
    </div>
  )
}
