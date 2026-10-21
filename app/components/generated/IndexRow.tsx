import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function IndexRow({ project }: { project: Project }) {
  const note = project.description ?? project.problem
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'minmax(150px, auto) 1fr' },
        alignItems: 'baseline',
        columnGap: 'clamp(14px, 2.4vw, 40px)',
        rowGap: '6px',
        paddingBlock: 'clamp(14px, 1.8vw, 26px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
        '&:nth-child(even) > a': { marginRight: { base: '0', md: 'clamp(0px, 4vw, 70px)' } },
      })}
    >
      <div
        className={css({
          order: { base: 2, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingTop: '8px',
          minWidth: '0',
        })}
      >
        <span className={css({ fontSize: 'clamp(15px, 1.3vw, 18px)', color: 'textMuted' })}>
          {project.year}
        </span>
        <span
          className={css({
            fontSize: '14px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {project.type}
        </span>
        {note ? (
          <span
            className={css({
              fontSize: '14px',
              lineHeight: '1.4',
              maxWidth: '34ch',
              color: 'textMuted',
            })}
          >
            {note}
          </span>
        ) : null}
      </div>
      <a
        href={`/work/${project.slug}`}
        className={css({
          order: { base: 1, md: 0 },
          display: 'block',
          minWidth: '0',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: 'clamp(52px, 15vw, 88px)', md: 'clamp(88px, 11vw, 150px)' },
          lineHeight: { base: '0.9', md: '0.84' },
          letterSpacing: 'normal',
          color: 'accent',
          textAlign: { base: 'left', md: 'right' },
          justifySelf: { base: 'start', md: 'end' },
          // mockup hover is gold-100; nearest semantic token is accentAlt
          _hover: { color: 'accentAlt' },
        })}
      >
        {project.title}
      </a>
    </div>
  )
}
