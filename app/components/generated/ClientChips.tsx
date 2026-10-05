import { css } from '../../../styled-system/css'

type Client = { name: string; logo?: string }

export function ClientChips({ clients }: { clients: Client[] }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
        gap: '12px',
      })}
    >
      {clients.map((c) => (
        <div
          key={c.name}
          title={c.name}
          className={css({
            // mockup sand50 chip; nearest semantic ground is surface (sand100)
            bg: 'surface',
            borderRadius: 'sm',
            paddingBlock: '16px',
            paddingInline: { base: '8px', md: '14px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70px',
          })}
        >
          {c.logo ? (
            <img
              src={c.logo}
              alt={c.name}
              className={css({ display: 'block', height: '30px', width: 'auto', maxWidth: '100%' })}
            />
          ) : (
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: { base: 'sm', md: 'xl' },
                color: 'text',
                letterSpacing: '-0.01em',
              })}
            >
              {c.name}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
