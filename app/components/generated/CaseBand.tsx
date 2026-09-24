import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function outbound(project: Project) {
  return [
    { label: 'Live site', url: project.liveUrl ?? '' },
    { label: 'Project site', url: project.externalUrl ?? '' },
    { label: 'Source', url: project.githubUrl ?? '' },
  ].filter((link) => link.url !== '')
}

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'baseline',
  columnGap: '14px',
  paddingBlock: '14px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
})
const labelClass = css({
  fontFamily: 'body',
  fontSize: 'xs',
  fontWeight: 600,
  fontVariantCaps: 'all-small-caps',
  letterSpacing: 'wide',
  color: 'fieldInkMuted',
})
const linkClass = css({
  fontFamily: 'display',
  fontSize: 'md',
  color: 'fieldInk',
  textAlign: 'right',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'fieldInkMuted' },
})

export function CaseBand({ project, next }: { project: Project; next?: Project }) {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: { base: '72px', xl: '88px' },
        paddingInline: '6vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 500,
          fontSize: 'lg',
          letterSpacing: 'tight',
          color: 'fieldInk',
          paddingBottom: '14px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Elsewhere
      </h2>
      {outbound(project).map((link) => (
        <div key={link.label} className={rowClass}>
          <span className={labelClass}>{link.label}</span>
          <a href={link.url} className={linkClass}>
            Open →
          </a>
        </div>
      ))}
      {next ? (
        <div className={rowClass}>
          <span className={labelClass}>Next in the ledger</span>
          <a href={`/work/${next.slug}`} className={linkClass}>
            {next.title} →
          </a>
        </div>
      ) : null}
    </section>
  )
}
