import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { revealClass } from './styles'

type Client = NonNullable<(typeof projects)[number]['clients']>[number]

export function ClientLedger({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null
  return (
    <section className={revealClass}>
      <div
        className={css({
          bg: 'field',
          color: 'fieldInk',
          paddingInline: { base: '20px', lg: '6vw' },
          paddingTop: { base: '6', lg: '7' },
        })}
      >
        <div
          className={css({
            marginBottom: '3',
            fontFamily: 'body',
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
          })}
        >
          Clients
        </div>
        <div
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'fieldBorder',
          })}
        >
          {clients.map((c) => (
            <div
              key={c.name}
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                columnGap: '12px',
                paddingBlock: '13px',
                paddingInline: '2px',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'fieldBorder',
              })}
            >
              <span
                className={css({
                  fontFamily: 'body',
                  fontSize: 'sm',
                  fontWeight: 'bold',
                  color: 'fieldInk',
                })}
              >
                {c.name}
              </span>
              <span
                className={css({
                  maxWidth: '48ch',
                  fontFamily: 'body',
                  fontSize: 'sm',
                  color: 'fieldInkMuted',
                })}
              >
                {c.description ?? ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
