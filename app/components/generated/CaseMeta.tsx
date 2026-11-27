import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type CaseProject = Project & { timeline?: string; status?: string }

function metaCells(p: CaseProject) {
  return [
    { k: 'Type', v: p.type },
    { k: 'Year', v: String(p.year) },
    { k: 'Role', v: p.role ?? '' },
    { k: 'Timeline', v: p.timeline ?? '' },
    { k: 'Status', v: p.status ?? '' },
  ].filter((c) => c.v)
}

export function CaseMeta({ project }: { project: Project }) {
  const cells = metaCells(project as CaseProject)
  return (
    <dl
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        rowGap: '4',
        columnGap: '6',
        margin: '0',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        paddingTop: '22px',
      })}
    >
      {cells.map((c) => (
        <div key={c.k} className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
          <dt
            className={css({
              textStyle: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {c.k}
          </dt>
          <dd className={css({ margin: '0', textStyle: 'base', color: 'text' })}>{c.v}</dd>
        </div>
      ))}
    </dl>
  )
}
