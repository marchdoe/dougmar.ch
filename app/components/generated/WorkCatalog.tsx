import { css } from '../../../styled-system/css'
import { experiments, featuredProject, type projects, selectedWork } from '../../content/projects'

type Project = (typeof projects)[number]
type CatalogItem = { project: Project; href: string }

const primary = featuredProject ? [featuredProject, ...selectedWork] : selectedWork

const workItems: CatalogItem[] = primary.map((project) => ({
  project,
  href: `/work/${project.slug}`,
}))

const experimentItems: CatalogItem[] = experiments.map((project) => ({
  project,
  href: project.externalUrl ?? `/work/${project.slug}`,
}))

function CatalogRow({ item }: { item: CatalogItem }) {
  const external = item.href.startsWith('http')
  const linkProps = external ? { target: '_blank', rel: 'noopener' } : {}
  return (
    <a
      href={item.href}
      {...linkProps}
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'baseline',
        rowGap: '2px',
        columnGap: '16px',
        paddingBlock: '18px',
        paddingInline: '4px',
        color: 'text',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        _hover: {
          color: 'accent',
          borderBottomColor: 'borderStrong',
          '& span': { color: 'accent' },
        },
      })}
    >
      <span
        className={css({
          gridColumn: '1',
          gridRow: '1',
          fontFamily: 'display',
          textTransform: 'uppercase',
          fontSize: 'clamp(30px,4.2vw,52px)',
          lineHeight: '0.92',
          letterSpacing: '0.01em',
          color: 'text',
        })}
      >
        {item.project.title}
      </span>
      <span
        className={css({
          gridColumn: '1',
          gridRow: '2',
          textStyle: 'xs',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        {item.project.type}
      </span>
      <span
        className={css({
          gridColumn: '2',
          gridRow: '1 / span 2',
          fontFamily: 'display',
          fontSize: 'clamp(22px,3vw,34px)',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {item.project.year}
      </span>
    </a>
  )
}

function Catalog({ items }: { items: CatalogItem[] }) {
  return (
    <div
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      {items.map((item) => (
        <CatalogRow key={item.project.slug} item={item} />
      ))}
    </div>
  )
}

export function WorkCatalog() {
  return (
    <div className={css({ minWidth: '0' })}>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          fontSize: 'clamp(24px,3vw,34px)',
          letterSpacing: '0.03em',
          color: 'text',
          marginBottom: '6px',
        })}
      >
        Selected Work
      </h2>
      <div
        className={css({
          textStyle: 'xs',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginBottom: '28px',
        })}
      >
        Questions, answered in public
      </div>
      <Catalog items={workItems} />
      <div
        className={css({
          textStyle: 'xs',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginTop: '30px',
          marginBottom: '4px',
        })}
      >
        Experiments
      </div>
      <Catalog items={experimentItems} />
    </div>
  )
}
