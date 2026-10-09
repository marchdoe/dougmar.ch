import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { HeroBand } from './HeroBand'

type Project = (typeof projects)[number]

function textField(p: Project, key: string): string {
  const v = (p as unknown as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

export function WorkHero({ project }: { project: Project }) {
  const facts = [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: textField(project, 'role') },
    { label: 'Timeline', value: textField(project, 'timeline') },
    { label: 'Status', value: textField(project, 'status') },
  ].filter((f) => f.value !== '')
  return (
    <section
      className={css({
        paddingTop: '40px',
        paddingInline: '24px',
        lg: { paddingTop: '60px', paddingInline: '4vw' },
        xl: { paddingTop: '72px', paddingInline: '5vw' },
      })}
    >
      <HeroBand home={false}>
        <h1
          className={css({
            position: 'relative',
            bg: 'field',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textAlign: 'left',
            fontSize: { base: '3xl', lg: '5xl', xl: 'hero' },
            lineHeight: 'tight',
            color: 'fieldInk',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '3',
            columnGap: '6',
            marginTop: '22px',
            bg: 'field',
            position: 'relative',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {facts.map((f) => (
            <div key={f.label}>
              <div
                className={css({
                  fontVariant: 'small-caps',
                  letterSpacing: 'wider',
                  fontSize: 'xs',
                  color: 'fieldInkMuted',
                })}
              >
                {f.label}
              </div>
              <div className={css({ fontSize: 'base', color: 'fieldInk' })}>{f.value}</div>
            </div>
          ))}
        </div>
      </HeroBand>
    </section>
  )
}
