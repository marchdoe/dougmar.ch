import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Client = NonNullable<(typeof projects)[number]['clients']>[number]

function ClientMark({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <img
        src={client.logo}
        alt={client.name}
        loading="lazy"
        className={css({ height: '40px', width: 'auto', maxWidth: '160px', objectFit: 'contain' })}
      />
    )
  }
  return (
    <span
      className={css({
        fontFamily: 'display',
        fontSize: '36px',
        lineHeight: '1',
        color: 'fieldInk',
      })}
    >
      {client.name}
    </span>
  )
}

export function ClientBand({ clients }: { clients?: Client[] }) {
  if (!clients || clients.length === 0) return null
  return (
    <section
      aria-label="Clients"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(32px, 4vw, 60px)',
        paddingInline: '5vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(40px, 5vw, 72px)',
          lineHeight: '1',
          marginBottom: '24px',
        })}
      >
        Clients
      </h2>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 'clamp(24px, 3vw, 48px)',
          rowGap: '20px',
        })}
      >
        {clients.map((client) => (
          <ClientMark key={client.name} client={client} />
        ))}
      </div>
    </section>
  )
}
