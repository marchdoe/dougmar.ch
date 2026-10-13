import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const sectionCss = css({
  position: 'relative',
  zIndex: 1,
  bg: 'bg',
  paddingBlock: '8',
  paddingInline: '6vw',
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})
const panelCss = css({
  boxSizing: 'border-box',
  width: { base: '100%', lg: '80%' },
  maxWidth: '100%',
  marginInline: 'auto',
  bg: 'surface',
  color: 'text',
  padding: { base: '5', lg: '7' },
  borderRadius: 'md',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
})
const metaCss = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  rowGap: '4',
  columnGap: '5',
  margin: '0',
})
const dtCss = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textMuted',
})
const ddCss = css({ fontFamily: 'body', fontSize: 'base', color: 'text', margin: '0' })
const headCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '2xl',
  lineHeight: 'tight',
  color: 'text',
  marginTop: '7',
  marginBottom: '3',
})
const bodyCss = css({
  fontFamily: 'body',
  fontSize: 'lg',
  lineHeight: 'normal',
  color: 'text',
  maxWidth: '50ch',
})
const tagsCss = css({
  listStyle: 'none',
  margin: '0',
  padding: '0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})
const tagCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'text',
  bg: 'bg',
  paddingBlock: '1',
  paddingInline: '3',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: 'sm',
})
const linkCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginTop: '6',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'base',
  color: 'accentAlt',
  _after: { content: '"↗"', marginLeft: '2' },
})

function field(project: Project, key: string): string {
  const value = (project as unknown as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

export function CaseStudy({ project }: { project: Project }) {
  const meta = [
    { k: 'Role', v: field(project, 'role') },
    { k: 'Timeline', v: field(project, 'timeline') },
    { k: 'Status', v: field(project, 'status') },
    { k: 'Type', v: project.type },
    { k: 'Year', v: String(project.year) },
  ].filter((m) => m.v !== '')
  const story = [
    { k: 'Problem', v: field(project, 'problem') },
    { k: 'Approach', v: field(project, 'approach') },
    { k: 'Outcome', v: field(project, 'outcome') },
  ].filter((s) => s.v !== '')
  const stack = project.stack ?? []
  return (
    <section className={sectionCss}>
      <div className={panelCss}>
        <dl className={metaCss}>
          {meta.map((m) => (
            <div key={m.k}>
              <dt className={dtCss}>{m.k}</dt>
              <dd className={ddCss}>{m.v}</dd>
            </div>
          ))}
        </dl>
        {story.map((s) => (
          <div key={s.k}>
            <h2 className={headCss}>{s.k}</h2>
            <p className={bodyCss}>{s.v}</p>
          </div>
        ))}
        <h2 className={headCss}>Stack</h2>
        <ul className={tagsCss}>
          {stack.map((t) => (
            <li key={t} className={tagCss}>
              {t}
            </li>
          ))}
        </ul>
        {project.liveUrl ? (
          <a href={project.liveUrl} className={linkCss}>
            Live site
          </a>
        ) : null}
      </div>
    </section>
  )
}
