import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Lab } from './Lab'

type Project = (typeof projects)[number]

function WorkRow({ project }: { project: Project }) {
  return (
    <a
      href={`/work/${project.slug}`}
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        columnGap: '24px',
        rowGap: '16px',
        paddingBlock: '22px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
        textDecoration: 'none',
        color: 'text',
        _firstOfType: { borderColor: 'borderStrong' },
        _hover: { bg: 'surface' },
      })}
    >
      <div className={css({ minWidth: 0 })}>
        <h3
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: 'clamp(26px, 3vw, 40px)',
            lineHeight: '1.05',
            color: 'text',
          })}
        >
          {project.title}
        </h3>
        <Lab>{`${project.type} · ${project.year}`}</Lab>
      </div>
      {/* Mockup arrow is accent; accentAlt holds contrast on bg at 22px. */}
      <span
        aria-hidden="true"
        className={css({
          color: 'accentAlt',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontSize: '22px',
        })}
      >
        →
      </span>
    </a>
  )
}

export function WorkGroup({
  label,
  items,
  spaced = false,
}: {
  label: string
  items: Project[]
  spaced?: boolean
}) {
  return (
    <div className={css({ marginTop: spaced ? '56px' : '0' })}>
      <div className={css({ marginBottom: '2' })}>
        <Lab>{label}</Lab>
      </div>
      {items.map((project) => (
        <WorkRow key={project.slug} project={project} />
      ))}
    </div>
  )
}
