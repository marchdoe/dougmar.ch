import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { EntryMeta } from './EntryMeta'

type P = (typeof projects)[number]

export function FeaturedEntry({ project }: { project: P }) {
  const lede = project.problem ?? project.description
  const ext = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  return (
    <div
      className={css({
        display: 'block',
        containerType: 'inline-size',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        paddingTop: '18px',
        paddingBottom: '20px',
        paddingInline: '2px',
        _hover: { bg: 'bgAlt' },
        '&:hover h3': { color: 'accent' },
        lg: { paddingTop: '26px', paddingBottom: '30px', paddingInline: '18px' },
      })}
    >
      <EntryMeta year={project.year} items={[project.role, project.type]} />
      <a href={`/work/${project.slug}`} className={css({ display: 'block' })}>
        <h3
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'normal',
            lineHeight: 'tight',
            color: 'text',
            fontSize: 'clamp(44px, 17cqi, 120px)',
            whiteSpace: 'nowrap',
          })}
        >
          {project.title}
        </h3>
      </a>
      {lede ? (
        <p
          className={css({
            fontSize: 'base',
            lineHeight: '1.55',
            color: 'textMuted',
            maxWidth: '48ch',
            marginTop: '14px',
            marginBottom: '14px',
          })}
        >
          {lede}
        </p>
      ) : null}
      <a
        href={ext}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '13px',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'accent',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
          paddingBlock: '6px',
          minHeight: '44px',
        })}
      >
        View project ↗
      </a>
    </div>
  )
}
