import { css } from '../../../styled-system/css'

type Client = { name: string; logo?: string }

// The mockup closes on a full 3×3 of nine marks. Three columns arrive at xl,
// where three tiles fit their names. At two columns an odd last tile spans the row
// so no empty cell is left behind.
export function ClientMarks({ clients }: { clients: Client[] }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px',
        bg: 'fieldBorder',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        flex: '1',
        xl: { gridTemplateColumns: 'repeat(3, 1fr)' },
      })}
    >
      {clients.slice(0, 9).map((client) => (
        <div
          key={client.name}
          className={css({
            bg: 'fieldInk',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBlock: '22px',
            paddingInline: '8px',
            minHeight: '88px',
            minWidth: 0,
            '&:last-child:nth-child(odd)': {
              gridColumn: '1 / -1',
              xl: { gridColumn: 'auto' },
            },
          })}
        >
          {client.logo ? (
            <img
              src={client.logo}
              alt={client.name}
              className={css({ height: '30px', width: 'auto', maxWidth: '100%' })}
            />
          ) : (
            <span
              className={css({
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: 'clamp(16px, 1.5vw, 22px)',
                letterSpacing: 'tight',
                color: 'field',
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
