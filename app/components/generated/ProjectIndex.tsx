import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function hrefFor(project: Project): string {
  if (project.depth === 'full') return `/work/${project.slug}`
  return project.externalUrl ?? `/work/${project.slug}`
}

const listClass = css({ listStyle: 'none', margin: '0', padding: '0' })
const itemClass = css({
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
})

const linkClass = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr auto', xl: '1fr 2fr auto' },
  alignItems: 'baseline',
  rowGap: '6px',
  columnGap: '16px',
  minHeight: '56px',
  paddingBlock: '12px',
  color: 'text',
  _hover: { textDecoration: 'none', '& span': { color: 'accent' } },
})

const titleClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(24px, 3.4vw, 40px)',
  lineHeight: '1',
  textTransform: 'uppercase',
  letterSpacing: '0.01em',
  gridColumn: '1',
  gridRow: '1',
})

const kindClass = css({
  gridColumn: { base: '1', xl: '2' },
  gridRow: { base: '2', xl: '1' },
  alignSelf: { xl: 'center' },
  textStyle: '2xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textFaint',
  fontWeight: 'bold',
})

const yearClass = css({
  gridColumn: { base: '2', xl: '3' },
  gridRow: '1',
  fontSize: '15px',
  fontWeight: 'bold',
  color: 'textFaint',
  fontVariantNumeric: 'tabular-nums',
})

export function ProjectIndex({ items }: { items: Project[] }) {
  return (
    <ul className={listClass}>
      {items.map((project) => (
        <li key={project.slug} className={itemClass}>
          <a href={hrefFor(project)} className={linkClass}>
            <span className={titleClass}>{project.title}</span>
            <span className={kindClass}>{project.type}</span>
            <span className={yearClass}>{project.year}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
