import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FactList } from './FactList'
import { grid, label } from './styles'

type Project = (typeof projects)[number]

function text(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

// At md the title tile takes the full row: two of four tracks at 820 left the
// display title a 329px column, too narrow for a single long word.
const heroTile = css({
  gridColumn: { base: '1 / -1', md: '1 / -1', lg: 'span 3' },
  bg: 'bg',
  minHeight: '40vh',
  minWidth: '0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '22px',
  paddingTop: { base: '26px', md: '34px' },
  paddingBottom: { base: '34px', md: '40px' },
  paddingInline: { base: 'clamp(16px, 5vw, 64px)', md: '40px' },
})
const title = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontVariant: 'small-caps',
  fontSize: { base: 'clamp(34px, 11vw, 46px)', md: 'clamp(56px, calc(9.6vw - 20px), 150px)' },
  lineHeight: '1.02',
  color: 'text',
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})
const eyebrow = cx(
  label,
  css({
    color: 'textMuted',
    animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
    animationDelay: '80ms',
  })
)

export function CaseHero({ project }: { project: Project }) {
  const extra: { timeline?: unknown; status?: unknown } = project
  return (
    <section className={grid}>
      <div className={heroTile}>
        <span className={eyebrow}>
          {project.type} · {project.year}
        </span>
        <h1 className={title}>{project.title}</h1>
      </div>
      <div
        className={css({
          gridColumn: { base: 'auto', md: '1 / -1', lg: 'auto' },
          bg: 'surface',
          minWidth: '0',
          paddingBlock: '22px',
          paddingInline: '22px',
        })}
      >
        <FactList
          onField={false}
          rows={[
            { term: 'Type', detail: project.type },
            { term: 'Year', detail: String(project.year) },
            { term: 'Role', detail: project.role ?? '' },
            { term: 'Timeline', detail: text(extra.timeline) },
            { term: 'Status', detail: text(extra.status) },
          ]}
        />
      </div>
    </section>
  )
}

export function CaseMissing() {
  return (
    <section className={grid}>
      <div
        className={css({
          gridColumn: '1 / -1',
          bg: 'bg',
          paddingBlock: '40px',
          paddingInline: { base: 'clamp(16px, 5vw, 64px)', md: '40px' },
        })}
      >
        <span className={eyebrow}>Work</span>
        <h1 className={cx(title, css({ marginBlock: '4' }))}>No project here.</h1>
        <a
          href="/#work"
          className={css({
            color: 'accent',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
          })}
        >
          Back to the index
        </a>
      </div>
    </section>
  )
}
