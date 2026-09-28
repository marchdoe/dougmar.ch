import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

export function MetaRows({ project }: { project: Project }) {
  const rows = [
    { k: 'Type', v: project.type },
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: project.role },
    { k: 'Timeline', v: project.timeline },
    { k: 'Status', v: project.status },
  ].filter((r) => Boolean(r.v))
  return (
    <div
      className={css({
        maxWidth: '420px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      {rows.map((r) => (
        <div
          key={r.k}
          className={css({
            display: 'grid',
            gridTemplateColumns: '110px 1fr',
            gap: '3',
            alignItems: 'baseline',
            paddingBlock: '10px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
          })}
        >
          <span
            className={css({
              fontFamily: 'body',
              fontSize: '2xs',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'fieldInkMuted',
            })}
          >
            {r.k}
          </span>
          <span
            className={css({
              fontFamily: 'body',
              fontSize: 'sm',
              color: 'fieldInk',
              minWidth: '0',
            })}
          >
            {r.v}
          </span>
        </div>
      ))}
    </div>
  )
}
