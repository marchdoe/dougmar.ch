import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]
type Client = NonNullable<Proj['clients']>[number]

function RosterCell({ client }: { client: Client }) {
  return (
    <div
      className={css({
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '72px',
        padding: '14px',
      })}
    >
      {client.logo ? (
        <img
          src={client.logo}
          alt={client.name}
          className={css({
            display: 'block',
            height: 'auto',
            width: 'auto',
            maxHeight: '28px',
            maxWidth: '86%',
          })}
        />
      ) : (
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'sm',
            color: 'text',
            letterSpacing: 'tight',
            textAlign: 'center',
            lineHeight: '1.1',
          })}
        >
          {client.name}
        </span>
      )}
    </div>
  )
}

export function Roster({ project }: { project: Proj }) {
  const clients = project.clients ?? []
  if (clients.length === 0) return null
  return (
    <div>
      <div
        className={css({
          marginTop: '44px',
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInk',
          bg: 'field',
          display: 'inline-block',
          paddingBlock: '3px',
        })}
      >
        The clients that action delineated
      </div>
      <div
        className={css({
          marginTop: '14px',
          display: 'grid',
          gridTemplateColumns: { base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: '1px',
          bg: 'border',
          border: '1px solid',
          borderColor: 'border',
        })}
      >
        {clients.map((c) => (
          <RosterCell key={c.name} client={c} />
        ))}
      </div>
    </div>
  )
}
