import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

// A range in the content may carry a dash; set it in words instead.
const toWords = (s: string) => s.replace(/\s*[\u2014\u2013]\s*/g, ' to ')

export function CaseHeader({ project }: { project: Project }) {
  const caption = [String(project.year), project.role].filter(Boolean).join(' · ')
  const meta = [project.type, project.timeline, project.status]
    .filter((s): s is string => Boolean(s))
    .map(toWords)
    .join(' · ')
  return (
    <section
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '12px',
        paddingTop: '72px',
        paddingBottom: '56px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: '500',
          textTransform: 'lowercase',
          letterSpacing: '0.22em',
          color: 'text',
        })}
      >
        {meta}
      </span>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: '40px', md: '5xl' },
          lineHeight: '0.95',
          letterSpacing: '-0.01em',
          textTransform: 'lowercase',
          color: 'fieldBorder',
          maxWidth: '100%',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: '2xl',
          textTransform: 'lowercase',
          color: 'text',
          maxWidth: '20ch',
        })}
      >
        {caption}
      </div>
    </section>
  )
}
