import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { revealClass } from './reveal'

type Project = (typeof projects)[number]

const sectionClass = css({
  bg: 'bg',
  paddingBlock: 'clamp(40px, 7vh, 88px)',
  paddingInline: 'clamp(20px, 5vw, 88px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
})

const partClass = css({
  display: { base: 'flex', lg: 'grid' },
  flexDirection: 'column',
  gridTemplateColumns: { lg: 'minmax(0, 5fr) minmax(0, 7fr)' },
  alignItems: { lg: 'start' },
  gap: '3',
  columnGap: { lg: '7' },
  borderTopWidth: '3px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  paddingTop: '4',
})

const h2Class = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(28px, 4vw, 52px)',
  lineHeight: '1',
  textTransform: 'uppercase',
  color: 'text',
})

const proseClass = css({
  textStyle: 'lede',
  lineHeight: '1.5',
  color: 'textMuted',
  maxWidth: '50ch',
})

export function CaseBody({ project }: { project: Project }) {
  const parts = [
    { label: 'Overview', text: project.description },
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ].filter((p): p is { label: string; text: string } => Boolean(p.text))
  return (
    <section className={cx(revealClass, sectionClass)}>
      {parts.map((part) => (
        <div key={part.label} className={partClass}>
          <h2 className={h2Class}>{part.label}</h2>
          <p className={proseClass}>{part.text}</p>
        </div>
      ))}
    </section>
  )
}
