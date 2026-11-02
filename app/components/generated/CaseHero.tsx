import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { SignalRow } from './SignalRow'

type P = (typeof projects)[number]

export function CaseHero({ project }: { project: P }) {
  const extra = project as unknown as { timeline?: string; status?: string }
  const facts = [
    { label: 'Year', fig: String(project.year), sub: undefined },
    { label: 'Type', fig: undefined, sub: project.type },
    { label: 'Role', fig: undefined, sub: project.role },
    { label: 'Timeline', fig: undefined, sub: extra.timeline },
    { label: 'Status', fig: undefined, sub: extra.status },
  ].filter((f) => f.fig || f.sub)
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        paddingTop: { base: '30px', lg: '48px' },
        paddingBottom: { base: '48px', lg: '72px' },
        paddingInline: { base: '6vw', lg: '5vw' },
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
        rowGap: { base: '34px', lg: '0' },
        columnGap: { base: '0', lg: '2vw' },
        alignItems: { lg: 'center' },
      })}
    >
      <div className={css({ gridColumn: { lg: '1 / 9' }, minWidth: '0' })}>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            color: 'textMuted',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
            _before: {
              content: '""',
              width: '28px',
              height: '4px',
              bg: 'accent',
              display: 'inline-block',
            },
          })}
        >
          Case Study
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(48px, 9vw, 132px)',
            lineHeight: '0.86',
            letterSpacing: '-0.01em',
            color: 'accent',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
      </div>
      <aside
        aria-label="Project facts"
        className={css({
          gridColumn: { lg: '9 / 13' },
          bg: 'surface',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          borderRadius: 'sm',
          paddingBlock: '8px',
          paddingInline: '20px',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {facts.map((f) => (
          <SignalRow key={f.label} label={f.label} fig={f.fig} sub={f.sub} />
        ))}
      </aside>
    </section>
  )
}
