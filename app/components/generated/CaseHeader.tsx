import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Extra = Project & { timeline?: string; status?: string }

export function CaseHeader({ project }: { project: Project }) {
  const extra = project as Extra
  const meta = [
    project.type,
    String(project.year),
    project.role,
    extra.timeline,
    extra.status,
  ].filter((item): item is string => Boolean(item))
  return (
    <section
      className={css({
        maxWidth: '1040px',
        marginInline: 'auto',
        paddingInline: { base: '4', lg: '7' },
        paddingTop: { base: '6', lg: '7' },
        paddingBottom: '5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4',
        textAlign: 'center',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          textStyle: { base: '3xl', md: '4xl', xl: '5xl' },
          lineHeight: 'tight',
          letterSpacing: 'tight',
          color: 'text',
          maxWidth: '18ch',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '4',
          rowGap: '1',
        })}
      >
        {meta.map((item) => (
          <span
            key={item}
            className={css({
              textStyle: 'xs',
              fontVariant: 'small-caps',
              letterSpacing: 'wider',
              color: 'textMuted',
            })}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
