import { css } from '../../../styled-system/css'

type RosterClient = { name: string; description?: string }

function RosterRow({ client, n }: { client: RosterClient; n: number }) {
  const first = n === 1
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'auto 1fr', sm: 'auto 1fr auto' },
        alignItems: 'baseline',
        columnGap: '4',
        rowGap: '1',
        paddingBlock: '4',
        borderTopStyle: 'solid',
        borderTopWidth: first ? '2px' : '1px',
        borderTopColor: first ? 'borderStrong' : 'border',
        textAlign: 'left',
      })}
    >
      <span
        className={css({
          textStyle: 'sm',
          lineHeight: '1',
          fontVariantNumeric: 'tabular-nums',
          color: { base: 'accentAlt', _light: 'text' },
        })}
      >
        {String(n).padStart(2, '0')}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: { base: 'lg', lg: 'xl' },
          lineHeight: 'tight',
          color: 'text',
        })}
      >
        {client.name}
      </span>
      {client.description ? (
        <span
          className={css({
            gridColumn: { base: '2', sm: 'auto' },
            textAlign: { base: 'left', sm: 'right' },
            maxWidth: { sm: '20ch' },
            alignSelf: 'center',
            textStyle: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {client.description}
        </span>
      ) : null}
    </div>
  )
}

export function ClientRoster({ clients }: { clients: RosterClient[] }) {
  if (clients.length === 0) return null
  return (
    <div
      className={css({
        alignSelf: 'flex-end',
        width: '100%',
        maxWidth: '680px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      <div
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          textAlign: 'right',
          marginTop: { base: '5', lg: '6' },
          marginBottom: '2',
        })}
      >
        Client set
      </div>
      {clients.map((c, i) => (
        <RosterRow key={c.name} client={c} n={i + 1} />
      ))}
    </div>
  )
}
