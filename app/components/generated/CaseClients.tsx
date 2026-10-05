import { css } from '../../../styled-system/css'

type Client = { name: string; logo?: string }

export function CaseClients({ clients }: { clients: Client[] | undefined }) {
  const list = clients ?? []
  if (list.length === 0) return null
  return (
    <ul
      className={css({
        listStyle: 'none',
        margin: '0',
        padding: '0',
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      })}
    >
      {list.map((c) => (
        <li
          key={c.name}
          className={css({
            bg: 'surface',
            borderRadius: 'sm',
            paddingBlock: '8px',
            paddingInline: '12px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
          })}
        >
          {c.logo ? (
            <img
              src={c.logo}
              alt={c.name}
              className={css({
                display: 'block',
                height: '24px',
                width: 'auto',
                maxWidth: '120px',
              })}
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
              {c.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
