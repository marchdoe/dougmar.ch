import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const boxCss = css({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '100%',
  minWidth: '0',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: '5',
  marginBottom: '56px',
  padding: { base: '5', lg: '6' },
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'borderStrong',
  borderRadius: 'md',
  bg: 'surface',
})
// Mockup sets the featured title at 92px on desktop; the phone steps to xl so the longest title fits.
const titleCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: { base: 'xl', lg: '92px' },
  lineHeight: 'tight',
  letterSpacing: 'tight',
  color: 'text',
})
const roleCss = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'accentAlt',
  marginTop: '2',
})
const problemCss = css({
  fontFamily: 'body',
  fontSize: 'lede',
  lineHeight: 'normal',
  color: 'textMuted',
  maxWidth: '50ch',
})
const linkCss = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'base',
  color: 'accent',
  minHeight: '44px',
  _hover: { color: 'accentAlt' },
  _after: { content: '"↗"' },
})

export function FeaturedProject({ project }: { project: Project }) {
  const roleLine = [project.role ?? '', String(project.year)].filter(Boolean).join(' · ')
  const problem = project.problem ?? project.description ?? ''
  const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  return (
    <article className={boxCss}>
      <div>
        <h3 className={titleCss}>{project.title}</h3>
        <p className={roleCss}>{roleLine}</p>
      </div>
      {problem ? <p className={problemCss}>{problem}</p> : null}
      <div>
        <a href={href} className={linkCss}>
          Read the case
        </a>
      </div>
    </article>
  )
}
