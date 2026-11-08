import { css } from '../../../styled-system/css'
import { experiments, projects } from '../../content/projects'
import { FeaturedProject } from './FeaturedProject'

type IndexItem = { title: string; href: string; meta: string }

function IndexRow({ title, href, meta }: IndexItem) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        rowGap: '2px',
        columnGap: '12px',
        paddingTop: '15px',
        paddingBottom: '13px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <a
        href={href}
        className={css({
          textStyle: { base: 'lg', lg: 'xl' },
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          color: 'text',
          whiteSpace: 'nowrap',
          paddingBlock: '4px',
          _hover: { color: 'accent' },
        })}
      >
        {title}
      </a>
      <span
        className={css({
          flex: '1',
          minWidth: '14px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'dotted',
          borderBottomColor: 'borderStrong',
          transform: 'translateY(-5px)',
          opacity: 0.6,
        })}
      />
      <span
        className={css({
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'textFaint',
          flex: 'none',
          marginLeft: 'auto',
          whiteSpace: 'nowrap',
        })}
      >
        {meta}
      </span>
    </div>
  )
}

function IndexColumn({ heading, items }: { heading: string; items: IndexItem[] }) {
  return (
    <div className={css({ minWidth: '0' })}>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          textStyle: 'lg',
          letterSpacing: 'wide',
          color: 'textFaint',
          paddingBottom: '10px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          marginBottom: '4px',
        })}
      >
        {heading}
      </h3>
      {items.map((item) => (
        <IndexRow key={item.title} {...item} />
      ))}
    </div>
  )
}

const fullDepth: IndexItem[] = projects
  .filter((project) => project.depth === 'full')
  .map((project) => ({
    title: project.title,
    href: `/work/${project.slug}`,
    meta: `${project.type} · ${project.year}`,
  }))

const experimentRows: IndexItem[] = experiments.map((project) => ({
  title: project.title,
  href: project.externalUrl ?? `/work/${project.slug}`,
  meta: `${project.type} · ${project.year}`,
}))

export function WorkIndex() {
  return (
    <section
      id="work"
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(44px,5vw,80px)',
        paddingInline: 'var(--pad)',
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '14px',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            fontSize: 'clamp(26px,4.4vw,44px)',
            lineHeight: '0.9',
            color: 'text',
          })}
        >
          Selected Work
        </h2>
        <span
          className={css({
            textStyle: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            fontWeight: 'bold',
            color: 'textFaint',
          })}
        >
          Design · Engineering · Founder
        </span>
      </div>
      <FeaturedProject />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
          gap: 'clamp(32px,4vw,56px)',
        })}
      >
        <IndexColumn heading="Projects" items={fullDepth} />
        <IndexColumn heading="Experiments" items={experimentRows} />
      </div>
    </section>
  )
}
