import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Client = NonNullable<Project['clients']>[number]

const chip = css({
  bg: 'text',
  borderRadius: 'sm',
  height: '40px',
  paddingInline: '13px',
  display: 'flex',
  alignItems: 'center',
})

export function ClientChips({ clients, lazy }: { clients: Client[]; lazy?: boolean }) {
  if (clients.length === 0) return null
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {clients.map((c) => (
        <span key={c.name} className={chip} title={c.name}>
          {c.logo ? (
            <img
              src={c.logo}
              alt={c.name}
              loading={lazy ? 'lazy' : undefined}
              className={css({ height: '18px', width: 'auto' })}
            />
          ) : (
            <span
              className={css({
                fontFamily: 'display',
                color: 'fieldInk',
                fontSize: '15px',
                lineHeight: '1',
              })}
            >
              {c.name}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
