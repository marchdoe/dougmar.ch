import { css } from '../../../styled-system/css'
import { selectedWork, experiments } from '../../content/projects'

type Item = {
  slug: string
  title: string
  type: string
  year: number
  depth: 'full' | 'lightweight'
  externalUrl?: string
  liveUrl?: string
}

function Row({ project }: { project: Item }) {
  const href =
    project.depth === 'lightweight'
      ? (project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`)
      : `/work/${project.slug}`

  return (
    <li
      className={css({
        borderTop: '1px solid',
        borderColor: 'border',
        _last: { borderBottom: '1px solid', borderColor: 'border' },
      })}
    >
      <a
        href={href}
        className={css({
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'baseline',
          gap: '4',
          paddingBlock: '5',
          minHeight: '44px',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: '500',
            textStyle: 'lg',
            letterSpacing: 'tight',
            color: 'text',
          })}
        >
          {project.title}
        </span>
        <span
          className={css({
            textStyle: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'textFaint',
            whiteSpace: 'nowrap',
            textAlign: 'right',
          })}
        >
          {project.type} · {project.year}
        </span>
      </a>
    </li>
  )
}

export function WorkIndex() {
  return (
    <section aria-labelledby="work-h">
      <div className={css({ marginBottom: '7' })}>
        <span
          className={css({
            textStyle: 'xs',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'textFaint',
            display: 'block',
            marginBottom: '5',
          })}
        >
          Selected work
        </span>
        <h2
          id="work-h"
          className={css({
            fontFamily: 'display',
            fontWeight: '700',
            textStyle: 'xl',
            letterSpacing: 'tight',
            color: 'text',
          })}
        >
          Built, shipped, run.
        </h2>
      </div>
      <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
        {selectedWork.map((p) => (
          <Row key={p.slug} project={p} />
        ))}
      </ul>

      <div className={css({ marginTop: '9', marginBottom: '4' })}>
        <span
          className={css({
            textStyle: 'xs',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'textFaint',
            display: 'block',
          })}
        >
          Experiments
        </span>
      </div>
      <ul className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
        {experiments.map((p) => (
          <Row key={p.slug} project={p} />
        ))}
      </ul>
    </section>
  )
}
