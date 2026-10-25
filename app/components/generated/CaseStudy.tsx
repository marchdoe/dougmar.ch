import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { pickFilled } from './KeyValueGrid'
import { RevealSection } from './RevealSection'
import { TagList } from './TagList'

export type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

type Item = { k: string; v: string }

export function caseMeta(project: CaseProject) {
  return pickFilled([
    { k: 'Year', v: String(project.year) },
    { k: 'Type', v: project.type },
    { k: 'Role', v: project.role },
    { k: 'Timeline', v: project.timeline },
    { k: 'Status', v: project.status },
  ])
}

const label = css({
  fontFamily: 'body',
  fontWeight: '600',
  fontSize: 'sm',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  fontVariantCaps: 'all-small-caps',
  color: 'accentAlt',
  marginBottom: '3',
})

const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'accent',
  fontWeight: '500',
  fontSize: 'base',
  _hover: { color: 'accentAlt' },
})

const grid = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: 'repeat(auto-fit, minmax(260px, 1fr))' },
  columnGap: '6',
  rowGap: '6',
})

function StoryGrid({ items }: { items: Item[] }) {
  return (
    <div className={grid}>
      {items.map((item) => (
        <article
          key={item.k}
          className={css({
            minWidth: '0',
            borderLeftWidth: { md: '1px' },
            borderLeftStyle: { md: 'solid' },
            borderColor: 'border',
            paddingLeft: { md: '5' },
          })}
        >
          <h3 className={label}>{item.k}</h3>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'lede',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '46ch',
            })}
          >
            {item.v}
          </p>
        </article>
      ))}
    </div>
  )
}

function StackBlock({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null
  return (
    <div className={css({ minWidth: '0' })}>
      <h3 className={label}>Stack</h3>
      <TagList items={stack} />
    </div>
  )
}

function LinksBlock({ links }: { links: Item[] }) {
  if (links.length === 0) return null
  return (
    <div className={css({ minWidth: '0', display: 'flex', flexDirection: 'column' })}>
      <h3 className={label}>Links</h3>
      {links.map((item) => (
        <a key={item.k} href={item.v} target="_blank" rel="noreferrer" className={link}>
          {item.k}
        </a>
      ))}
    </div>
  )
}

function DetailsSection({ stack, links }: { stack: string[]; links: Item[] }) {
  if (stack.length + links.length === 0) return null
  return (
    <RevealSection label="Details">
      <div className={grid}>
        <StackBlock stack={stack} />
        <LinksBlock links={links} />
      </div>
    </RevealSection>
  )
}

export function CaseStudy({ project }: { project: CaseProject }) {
  const story = pickFilled([
    { k: 'Overview', v: project.description },
    { k: 'Problem', v: project.problem },
    { k: 'Approach', v: project.approach },
    { k: 'Outcome', v: project.outcome },
  ])
  const links = pickFilled([
    { k: 'Visit the live project', v: project.liveUrl },
    { k: 'Read the source on GitHub', v: project.githubUrl },
  ])
  return (
    <>
      {story.length > 0 ? (
        <RevealSection label="The work">
          <StoryGrid items={story} />
        </RevealSection>
      ) : null}
      <DetailsSection stack={project.stack ?? []} links={links} />
    </>
  )
}
