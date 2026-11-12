import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Label } from './LedgerParts'

type Project = (typeof projects)[number]

const facts = css({ margin: 0 })

const fact = css({
  paddingTop: '8px',
  paddingBottom: '10px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
})

const factValue = css({
  margin: 0,
  marginTop: '2px',
  textStyle: 'sm',
  lineHeight: '1.5',
  color: 'text',
})

const group = css({
  marginTop: '24px',
  paddingTop: '8px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
})

const groupList = css({
  listStyle: 'none',
  marginTop: '4px',
  marginBottom: '0px',
  padding: 0,
  textStyle: 'sm',
  lineHeight: '1.55',
  color: 'text',
})

const links = css({
  marginTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  textStyle: 'sm',
  fontWeight: 'bold',
  color: 'text',
})

function CaseFacts({ project }: { project: Project }) {
  const rows = [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
  ].filter((row) => row.value)
  return (
    <dl className={facts}>
      {rows.map((row) => (
        <div key={row.label} className={fact}>
          <dt>
            <Label>{row.label}</Label>
          </dt>
          <dd className={factValue}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function MetaGroup({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className={group}>
      <Label>{label}</Label>
      <ul className={groupList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function CaseLinks({ project }: { project: Project }) {
  const outbound = [
    { label: `Visit ${project.title} ↗`, href: project.liveUrl ?? project.externalUrl },
    { label: 'Source on GitHub ↗', href: project.githubUrl },
  ].filter((entry) => entry.href)
  return (
    <div className={links}>
      {outbound.map((entry) => (
        <a key={entry.label} href={entry.href} className={link}>
          {entry.label}
        </a>
      ))}
    </div>
  )
}

export function CaseMeta({ project }: { project: Project }) {
  const clients = project.clients ?? []
  const stack = project.stack ?? []
  return (
    <aside aria-label="Project details" className={css({ minWidth: 0, paddingTop: { md: '6px' } })}>
      <CaseFacts project={project} />
      <MetaGroup label="Clients" items={clients.map((client) => client.name)} />
      <MetaGroup label="Stack" items={stack} />
      <CaseLinks project={project} />
    </aside>
  )
}
