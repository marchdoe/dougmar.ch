import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function FeaturedCaption({ project }: { project: Project }) {
  const copy = [project.problem, project.description].find(Boolean)
  const href = [project.externalUrl, project.liveUrl].find(Boolean) ?? `/work/${project.slug}`
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        paddingBottom: 'clamp(18px, 2.4vw, 30px)',
        textAlign: 'right',
      })}
    >
      <p
        className={css({
          textStyle: 'base',
          lineHeight: 'normal',
          color: 'text',
          maxWidth: '48ch',
        })}
      >
        {copy}
      </p>
      <a
        href={href}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          minWidth: '44px',
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'accent',
          paddingBlock: '12px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
          _hover: { textDecoration: 'none', color: 'accentAlt' },
        })}
      >
        Open project ↗
      </a>
    </div>
  )
}

export function WorkRow({ project, index }: { project: Project; index: number }) {
  return (
    <div
      role="listitem"
      className={css({
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        transition: 'background 0.18s ease',
        '&:hover, &:focus-within': {
          bg: 'accent',
          '& span, & p, & a': { color: 'accentText', borderColor: 'accentText' },
        },
      })}
    >
      <a
        href={`/work/${project.slug}`}
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', sm: 'row' },
          alignItems: { base: 'flex-end', sm: 'baseline' },
          justifyContent: { sm: 'space-between' },
          gap: { base: '6px', sm: 'clamp(20px, 4vw, 64px)' },
          paddingBlock: 'clamp(18px, 2.4vw, 30px)',
          color: 'inherit',
          _hover: { textDecoration: 'none' },
        })}
      >
        <span
          className={css({
            display: 'flex',
            flexDirection: { base: 'row', sm: 'column' },
            alignItems: { base: 'baseline', sm: 'flex-start' },
            gap: { base: '14px', sm: '5px' },
            fontFamily: 'body',
            textStyle: '2xs',
            textTransform: 'uppercase',
            flexShrink: 0,
          })}
        >
          <span
            className={css({
              fontWeight: 'bold',
              letterSpacing: 'wide',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {String(index).padStart(2, '0')}
          </span>
          <span
            className={css({ fontWeight: 'normal', letterSpacing: 'wider', color: 'textFaint' })}
          >
            {project.type}
            {project.featured ? ' · Featured' : ''}
          </span>
          <span
            className={css({
              fontWeight: 'normal',
              letterSpacing: 'wide',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {project.year}
          </span>
        </span>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'clamp(30px, 10vw, 44px)', sm: 'clamp(44px, 6vw, 96px)' },
            lineHeight: '0.98',
            letterSpacing: '-0.005em',
            textTransform: 'uppercase',
            color: 'text',
            textAlign: 'right',
            whiteSpace: 'nowrap',
          })}
        >
          {project.title}
        </span>
      </a>
      {project.featured ? <FeaturedCaption project={project} /> : null}
    </div>
  )
}
