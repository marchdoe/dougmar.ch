import { css } from '../../../styled-system/css'
import type { CaseProject } from './caseFields'
import { field } from './caseFields'

export function CaseHeader({ project }: { project: CaseProject }) {
  const clients = (project.clients ?? []).map((c) => c.name).join(', ')
  const deck = [String(project.year), field(project, 'role'), clients]
    .filter((s) => s !== '')
    .join(' · ')
  return (
    <section
      className={css({
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
      })}
    >
      <span
        className={css({
          display: 'block',
          textStyle: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {project.type}
      </span>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          fontSize: { base: '36px', md: '64px', xl: '96px' },
          lineHeight: 'tight',
          letterSpacing: 'tight',
          color: 'transparent',
          WebkitTextStroke: '2px token(colors.accent)',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <span
        className={css({
          display: 'block',
          fontFamily: 'body',
          textStyle: '2xl',
          color: 'textMuted',
          maxWidth: '40ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {deck}
      </span>
    </section>
  )
}
