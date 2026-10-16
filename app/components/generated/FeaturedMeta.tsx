import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

export function FeaturedMeta({ project }: { project: Proj }) {
  const items = [
    { label: 'Role', value: project.role },
    { label: 'Year', value: String(project.year) },
  ].filter((i) => Boolean(i.value))
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '10px',
        columnGap: '26px',
        marginTop: '18px',
        fontFamily: 'body',
        fontWeight: 'bold',
        fontSize: 'lede',
        color: 'fieldInk',
      })}
    >
      {items.map((i) => (
        <span key={i.label} className={css({ bg: 'field', display: 'inline-block' })}>
          <span
            className={css({
              display: 'block',
              fontSize: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
              marginBottom: '2px',
            })}
          >
            {i.label}
          </span>
          {i.value}
        </span>
      ))}
    </div>
  )
}
