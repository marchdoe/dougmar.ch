import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { microClass } from './styles'

type Item = (typeof projects)[number]

function hrefFor(p: Item): string {
  if (p.depth === 'full') return `/work/${p.slug}`
  return p.externalUrl ?? `/work/${p.slug}`
}

function WorkRow({ project }: { project: Item }) {
  const href = hrefFor(project)
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        columnGap: '12px',
        rowGap: '1',
        paddingBlock: '14px',
        paddingInline: '2px',
        minHeight: '44px',
        color: 'text',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        _hover: { borderBottomColor: 'borderStrong', color: 'text', textDecoration: 'none' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: { base: 'md', lg: 'xl' },
          lineHeight: '1',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          color: 'text',
        })}
      >
        {project.title}
      </span>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          textAlign: 'right',
          color: 'text',
        })}
      >
        {project.type}
        <span className={css({ marginLeft: '8px', fontVariantNumeric: 'tabular-nums' })}>
          {project.year}
        </span>
      </span>
    </a>
  )
}

export function WorkRows({
  label,
  heading,
  items,
}: {
  label: string
  heading?: string
  items: Item[]
}) {
  return (
    <div>
      <div className={microClass}>{label}</div>
      {heading ? (
        <h2
          className={css({
            marginBottom: '18px',
            fontFamily: 'body',
            fontWeight: 'bold',
            textStyle: 'xl',
            lineHeight: '1.05',
            letterSpacing: '-0.015em',
            color: 'text',
          })}
        >
          {heading}
        </h2>
      ) : null}
      <div>
        {items.map((p) => (
          <WorkRow key={p.slug} project={p} />
        ))}
      </div>
    </div>
  )
}
