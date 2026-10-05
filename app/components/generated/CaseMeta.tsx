import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseClients } from './CaseClients'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

export function CaseMeta({ project }: { project: CaseProject }) {
  const pairs: [string, string | undefined][] = [
    ['Role', project.role],
    ['Year', String(project.year)],
    ['Type', project.type],
    ['Timeline', project.timeline],
    ['Status', project.status],
  ]
  const rows = pairs.flatMap(([label, value]) => (value ? [{ label, value }] : []))
  return (
    <div
      className={css({
        gridColumn: { lg: '9 / 13' },
        gridRow: { lg: '2' },
        alignSelf: { lg: 'end' },
        // flat bg ground so the meta labels clear 4.5:1 over the ruled material
        bg: 'bg',
        paddingBlockEnd: '2',
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      <dl
        className={css({
          margin: '0',
          bg: 'bg',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'field',
        })}
      >
        {rows.map((r) => (
          <div
            key={r.label}
            className={css({
              display: 'grid',
              gridTemplateColumns: '100px minmax(0, 1fr)',
              columnGap: '16px',
              paddingBlock: '10px',
              bg: 'bg',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <dt
              className={css({
                fontSize: 'xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              {r.label}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontSize: 'sm',
                color: 'text',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <CaseClients clients={project.clients} />
    </div>
  )
}
