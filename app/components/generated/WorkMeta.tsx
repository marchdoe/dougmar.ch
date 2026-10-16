import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

function textOf(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function metaItems(p: Proj) {
  const extra: Record<string, unknown> = { ...p }
  return [
    { label: 'Role', value: p.role },
    { label: 'Year', value: String(p.year) },
    { label: 'Type', value: p.type },
    { label: 'Timeline', value: textOf(extra.timeline) },
    { label: 'Status', value: textOf(extra.status) },
    { label: 'Stack', value: (p.stack ?? []).join(', ') },
  ].filter((m) => Boolean(m.value))
}

function outLinks(p: Proj) {
  return [
    { label: 'Visit the live site', url: p.liveUrl },
    { label: 'Source on GitHub', url: p.githubUrl },
  ].filter((l) => Boolean(l.url))
}

export function WorkMeta({ project }: { project: Proj }) {
  return (
    <div className={css({ marginTop: '6' })}>
      <dl
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr 1fr', md: 'repeat(3, 1fr)' },
          columnGap: '4',
          borderTop: '1px solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        {metaItems(project).map((m) => (
          <div
            key={m.label}
            className={css({
              paddingBlock: '3',
              borderBottom: '1px solid',
              borderBottomColor: 'fieldBorder',
              minWidth: '0',
            })}
          >
            <dt
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                marginBottom: '1',
              })}
            >
              {m.label}
            </dt>
            <dd className={css({ fontSize: 'base', fontWeight: 'bold', color: 'fieldInk' })}>
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', marginTop: '3' })}>
        {outLinks(project).map((l) => (
          <a
            key={l.label}
            href={l.url}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontWeight: 'bold',
              color: 'fieldInk',
              borderBottom: '2px solid',
              borderBottomColor: 'fieldBorder',
              _hover: { color: 'fieldInkMuted', borderBottomColor: 'fieldInk' },
            })}
          >
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  )
}
