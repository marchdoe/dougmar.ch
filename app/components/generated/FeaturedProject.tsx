import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function linkFor(project: Project): string {
  return project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
}

const wrapClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  paddingTop: '22px',
  paddingBottom: '28px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
})

// accent on bg measured 2.1:1, so the tag and the link take text ink
const tagClass = css({
  textStyle: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'text',
  fontWeight: 'bold',
})

const titleClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(40px, 7vw, 96px)',
  lineHeight: '0.92',
  textTransform: 'uppercase',
  color: 'text',
})

const metaClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: '18px',
  rowGap: '4px',
  textStyle: 'xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textFaint',
  fontWeight: 'bold',
})

const problemClass = css({
  textStyle: 'lede',
  lineHeight: '1.5',
  maxWidth: '50ch',
  color: 'textMuted',
})

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '44px',
  textStyle: 'sm',
  fontWeight: 'bold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'text',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textDecorationThickness: '2px',
  textUnderlineOffset: '4px',
  _hover: { color: 'text', textDecorationColor: 'text' },
})

export function FeaturedProject({ project }: { project: Project }) {
  const meta = [project.role, String(project.year)].filter((v): v is string => Boolean(v))
  const problem = project.problem ?? project.description
  return (
    <div className={wrapClass}>
      <span className={tagClass}>Featured, the studio</span>
      <div className={titleClass}>{project.title}</div>
      <div className={metaClass}>
        {meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      {problem ? <p className={problemClass}>{problem}</p> : null}
      <a href={linkFor(project)} className={linkClass}>
        View the studio →
      </a>
    </div>
  )
}
