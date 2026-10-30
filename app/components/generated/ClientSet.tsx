import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Label } from './Label'

type Clients = NonNullable<(typeof projects)[number]['clients']>

export function ClientSet({ clients }: { clients: Clients }) {
  if (clients.length === 0) return null
  return (
    <section
      aria-label="Client set"
      className={css({
        marginTop: '36px',
        paddingTop: '22px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ marginBottom: '18px' })}>
        <Label>Clients · A ten-year client list</Label>
      </div>
      {/* the mockup sets each client as its name in the display face at 20px, not as a mark */}
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          rowGap: '14px',
          columnGap: { base: '24px', lg: '40px' },
          listStyle: 'none',
          margin: '0',
          padding: '0',
        })}
      >
        {clients.map((client) => (
          <li
            key={client.name}
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              fontSize: '20px',
              letterSpacing: 'wide',
              color: 'text',
              lineHeight: '1.2',
            })}
          >
            {client.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
