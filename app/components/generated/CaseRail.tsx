import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Block, ClusterRow } from './LedgerRows'
import { Rail } from './Rail'

type Project = (typeof projects)[number]
type Extra = { timeline?: string; status?: string }

const stackClass = css({
  listStyle: 'none',
  margin: '0',
  padding: '0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})
const chipClass = css({
  textStyle: 'sm',
  color: 'fieldInk',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'fieldBorder',
  paddingBlock: '4px',
  paddingInline: '8px',
})

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  textStyle: 'sm',
  fontWeight: 'bold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'fieldInk',
  textDecoration: 'underline',
  textDecorationColor: 'accentAlt',
  textUnderlineOffset: '4px',
  _hover: { color: 'accentAlt' },
})

export function CaseRail({ project }: { project: Project }) {
  const extra = project as Project & Extra
  const facts = [
    { name: 'Type', value: project.type },
    { name: 'Year', value: String(project.year) },
    { name: 'Role', value: project.role },
    { name: 'Timeline', value: extra.timeline },
    { name: 'Status', value: extra.status },
  ].filter((f): f is { name: string; value: string } => Boolean(f.value))
  const links = [
    { name: 'Live site', url: project.liveUrl },
    { name: 'Source', url: project.githubUrl },
    { name: 'Visit', url: project.externalUrl },
  ].filter((l): l is { name: string; url: string } => Boolean(l.url))
  return (
    <Rail label="Project file" title="Project File" meta={String(project.year)}>
      <Block label="Facts">
        {facts.map((f) => (
          <ClusterRow key={f.name} name={f.name} value={f.value} />
        ))}
      </Block>
      <Block label="Stack">
        <ul className={stackClass}>
          {(project.stack ?? []).map((s) => (
            <li key={s} className={chipClass}>
              {s}
            </li>
          ))}
        </ul>
      </Block>
      <Block label="Links">
        {links.map((l) => (
          <a key={l.name} href={l.url} className={linkClass}>
            {l.name} ↗
          </a>
        ))}
      </Block>
    </Rail>
  )
}
