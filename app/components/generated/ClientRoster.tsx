import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { ClientTile } from './ClientTile'

export function ClientRoster() {
  const clients = featuredProject?.clients ?? []
  return (
    <section
      aria-label="Clients"
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(10px, 3vw, 24px)',
        paddingBottom: 'clamp(22px, 3vw, 30px)',
        lg: { paddingLeft: '0', paddingTop: '2' },
      })}
    >
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          fontWeight: 'bold',
          marginBottom: '1em',
        })}
      >
        Ten years of clients, the receipt
      </h2>
      <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2' })}>
        {clients.map((client) => (
          <ClientTile key={client.name} client={client} />
        ))}
      </div>
    </section>
  )
}
