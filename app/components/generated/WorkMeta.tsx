import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type CaseProject = (typeof projects)[number]

export function WorkMeta({ project }: { project: CaseProject }) {
  const rows = [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role ?? '' },
  ].filter((row) => row.value)
  return (
    <dl
      className={css({
        margin: '0',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderRadius: 'md',
        overflow: 'hidden',
      })}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className={css({
            paddingBlock: '3',
            paddingInline: '20px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'border',
            _last: { borderBottomWidth: '0' },
          })}
        >
          <dt
            className={css({
              fontSize: '2xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'textFaint',
              marginBottom: '1',
            })}
          >
            {row.label}
          </dt>
          <dd
            className={css({
              margin: '0',
              fontFamily: 'display',
              fontSize: '17px',
              color: 'text',
              lineHeight: 'snug',
            })}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
