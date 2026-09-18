import { css } from '../../../styled-system/css'

type Client = { name: string; logo?: string }

export function ClientChips({ clients }: { clients: Client[] }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
        gap: '2',
      })}
    >
      {clients.map((client) => (
        <div
          key={client.name}
          className={css({
            bg: 'surface',
            borderRadius: 'sm',
            minHeight: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2',
          })}
        >
          {client.logo ? (
            <img
              src={client.logo}
              alt={client.name}
              loading="lazy"
              className={css({ maxHeight: '22px', width: 'auto', maxWidth: 'full' })}
            />
          ) : (
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'sm',
                color: 'text',
              })}
            >
              {client.name}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
