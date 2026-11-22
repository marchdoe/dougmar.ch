import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import type { projects } from '../../content/projects'
import { RevealSection } from './RevealSection'
import { SectionLabel } from './SectionLabel'
import { deck, metaCell, rowGrid, sectionPad, visit, yearSpan } from './rows'

type Project = (typeof projects)[number]

const titleWrap = css({ textAlign: 'right', md: { gridColumn: '3', gridRow: '1' } })

const titleLink = css({
  display: 'inline-block',
  minHeight: '44px',
  fontFamily: 'display',
  fontWeight: 'normal',
  letterSpacing: '-0.02em',
  lineHeight: '1',
  fontSize: {
    base: 'clamp(40px, 11vw, 60px)',
    md: 'clamp(56px, 6.5vw, 96px)',
    lg: 'clamp(72px, 8vw, 128px)',
  },
  color: 'text',
  borderBottom: '2px solid',
  borderColor: 'transparent',
  paddingBottom: '2px',
  _hover: { color: 'accent', borderColor: 'accent' },
})

function Meta({ year, rest }: { year: number; rest: string[] }) {
  return (
    <p className={metaCell}>
      <span className={yearSpan}>{year}</span>
      {rest.map((part) => ` · ${part}`).join('')}
    </p>
  )
}

function WorkRow({ project }: { project: Project }) {
  return (
    <article className={rowGrid}>
      <Meta year={project.year} rest={[project.type]} />
      <p className={titleWrap}>
        <a href={`/work/${project.slug}`} className={titleLink}>
          {project.title}
        </a>
      </p>
    </article>
  )
}

function FeaturedRow({ project }: { project: Project }) {
  const url = project.externalUrl ?? project.liveUrl ?? ''
  const rest = [project.role ?? '', 'featured'].filter(Boolean)
  return (
    <article className={rowGrid}>
      <Meta year={project.year} rest={rest} />
      <p className={titleWrap}>
        <a href={`/work/${project.slug}`} className={titleLink}>
          {project.title}
        </a>
      </p>
      <div
        className={css({
          textAlign: 'right',
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
          md: { gridColumn: '3', gridRow: '2', marginTop: '16px' },
        })}
      >
        <p className={deck}>{project.problem ?? project.description}</p>
        <a href={url} className={visit}>
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
        </a>
      </div>
    </article>
  )
}

export function WorkIndex() {
  return (
    <RevealSection label="Selected work" className={sectionPad}>
      <SectionLabel>selected work</SectionLabel>
      {featuredProject ? <FeaturedRow project={featuredProject} /> : null}
      {selectedWork.map((p) => (
        <WorkRow key={p.slug} project={p} />
      ))}
      <SectionLabel ruled>experiments</SectionLabel>
      {experiments.map((p) => (
        <WorkRow key={p.slug} project={p} />
      ))}
    </RevealSection>
  )
}
