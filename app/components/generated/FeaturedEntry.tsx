import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function FeaturedEntry({ project }: { project: Project }) {
  const outbound = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  const yearRole = [String(project.year), project.role].filter(Boolean).join(' · ')
  const statement = project.description ?? project.problem
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(10px, 2vw, 22px)',
        paddingTop: 'clamp(12px, 2.4vw, 30px)',
        paddingBottom: 'clamp(20px, 2.8vw, 34px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'border',
      })}
    >
      {/* accent fails 4.5:1 at label size on the light ground; small labels take text on a flat bg */}
      <span
        className={css({
          justifySelf: 'start',
          width: 'fit-content',
          bg: 'bg',
          fontSize: '13px',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'text',
          fontWeight: 'bold',
        })}
      >
        Featured project
      </span>
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'column-reverse', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { base: 'flex-start', md: 'flex-end' },
          gap: { base: '8px', md: '16px' },
          flexWrap: 'wrap',
        })}
      >
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4px' })}>
          <span
            className={css({
              width: 'fit-content',
              bg: 'bg',
              fontSize: 'clamp(16px, 1.3vw, 19px)',
              fontWeight: 'bold',
              color: 'text',
            })}
          >
            {yearRole}
          </span>
          <span
            className={css({
              width: 'fit-content',
              bg: 'bg',
              fontSize: '14px',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
            })}
          >
            {project.type}
          </span>
        </div>
        <a
          href={`/work/${project.slug}`}
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: 'clamp(52px, 15vw, 88px)', md: 'clamp(88px, 11vw, 150px)' },
            lineHeight: { base: '0.9', md: '0.84' },
            color: 'accent',
            textAlign: { base: 'left', md: 'right' },
            _hover: { color: 'accentAlt' },
          })}
        >
          {project.title}
        </a>
      </div>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '20px',
          flexWrap: 'wrap',
        })}
      >
        {statement ? (
          <p
            className={css({
              fontSize: { base: '16px', md: '19px' },
              lineHeight: '1.55',
              color: 'text',
              maxWidth: '50ch',
            })}
          >
            {statement}
          </p>
        ) : null}
        <a
          href={outbound}
          className={css({
            flex: '0 0 auto',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            paddingBlock: '10px',
            paddingInline: '20px',
            bg: 'field',
            color: 'fieldInk',
            fontSize: '14px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            borderRadius: 'sm',
            _hover: { bg: 'accent', color: 'fieldInk' },
          })}
        >
          Open case ↗
        </a>
      </div>
    </div>
  )
}
