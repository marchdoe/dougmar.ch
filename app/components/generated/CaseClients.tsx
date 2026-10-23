import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Client = NonNullable<(typeof projects)[number]['clients']>[number]

export function CaseClients({ clients }: { clients: Client[] | undefined }) {
  if (!clients || clients.length === 0) return null
  return (
    <div
      className={css({
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        paddingTop: '12px',
      })}
    >
      <div
        className={css({
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '12px',
        })}
      >
        clients
      </div>
      <div
        className={css({ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' })}
      >
        {clients.map((c) =>
          c.logo ? (
            <img
              key={c.name}
              src={c.logo}
              alt={c.name}
              loading="lazy"
              className={css({ height: '28px', width: 'auto', maxWidth: '120px' })}
            />
          ) : (
            <span
              key={c.name}
              className={css({
                fontFamily: 'display',
                fontWeight: '600',
                fontSize: 'base',
                color: 'accent',
              })}
            >
              {c.name}
            </span>
          )
        )}
      </div>
    </div>
  )
}
