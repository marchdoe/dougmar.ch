import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { IndexRow } from './IndexRow'

type Project = (typeof projects)[number]

export function IndexList({ items }: { items: Project[] }) {
  return (
    <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
      {items.map((item) => (
        <IndexRow
          key={item.slug}
          href={
            item.depth === 'full'
              ? `/work/${item.slug}`
              : (item.externalUrl ?? `/work/${item.slug}`)
          }
          title={item.title}
          year={String(item.year)}
          type={item.type}
        />
      ))}
    </ul>
  )
}
