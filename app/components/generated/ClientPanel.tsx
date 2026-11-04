import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Client = NonNullable<(typeof projects)[number]['clients']>[number]

function ClientItem({ client, marks }: { client: Client; marks: boolean }) {
  if (marks && client.logo) {
    return (
      <li className={css({ display: 'flex', alignItems: 'center' })}>
        <img
          src={client.logo}
          alt={client.name}
          className={css({ display: 'block', height: '28px', width: 'auto', maxWidth: '120px' })}
        />
      </li>
    )
  }
  return (
    <li
      className={css({
        fontFamily: 'body',
        fontWeight: 'bold',
        fontSize: 'clamp(16px, 1.7vw, 20px)',
        lineHeight: '1.2',
        letterSpacing: '-0.01em',
        color: 'text',
        '&:not(:last-child)::after': {
          content: '"·"',
          color: 'textFaint',
          marginLeft: '10px',
          fontWeight: 'normal',
        },
      })}
    >
      {client.name}
    </li>
  )
}

export function BoardClients({
  clients,
  label,
  marks = false,
}: {
  clients: Client[]
  label: string
  marks?: boolean
}) {
  if (clients.length === 0) return null
  return (
    <div
      className={css({
        bg: 'surface',
        color: 'text',
        borderRadius: 'sm',
        paddingBlock: '18px',
        paddingInline: '16px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '16px',
        })}
      >
        {label}
      </div>
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          rowGap: '14px',
          columnGap: '10px',
        })}
      >
        {clients.map((client) => (
          <ClientItem key={client.name} client={client} marks={marks} />
        ))}
      </ul>
    </div>
  )
}
