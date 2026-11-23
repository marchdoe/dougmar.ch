import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'
import { band, label, reveal } from './styles'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const all: [string, string | undefined][] = [
    ['Summary', project.description],
    ['Problem', project.problem],
    ['Approach', project.approach],
    ['Outcome', project.outcome],
  ]
  const rows = all.filter((r): r is [string, string] => Boolean(r[1]))
  return (
    <section aria-label="Case study" className={cx(band, reveal)}>
      {rows.map(([k, v]) => (
        <div
          key={k}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '200px minmax(0, 1fr)' },
            columnGap: '6',
            paddingBlock: '5',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span className={label}>{k}</span>
          <p
            className={css({
              textStyle: 'lede',
              color: 'text',
              maxWidth: '56ch',
              lineHeight: 'normal',
            })}
          >
            {v}
          </p>
        </div>
      ))}
      <CaseLinks project={project} />
    </section>
  )
}
