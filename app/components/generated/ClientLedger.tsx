import { css } from '../../../styled-system/css'
import type { Client } from '../../content/projects'

export function ClientLedger({ clients }: { clients: Client[] }) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        padding: { base: '9 5 10', lg: '64px 40px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      <p
        className={css({
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '1',
        })}
      >
        The Client Set
      </p>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'xl',
          color: 'text',
          marginBottom: '1',
          lineHeight: 'snug',
        })}
      >
        Ten years, shipped for teams who kept the receipts.
      </h2>
      <p
        className={css({
          fontSize: 'base',
          color: 'textMuted',
          maxWidth: '44ch',
          marginBottom: '6',
        })}
      >
        Each mark below is a design carried faithfully into build under the Spaceman name.
      </p>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr 1fr', lg: '1fr 1fr 1fr' },
          border: '1px solid',
          borderColor: 'border',
          borderBottomWidth: 0,
        })}
      >
        {clients.map((client) => (
          <div
            key={client.name}
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
              minHeight: '96px',
              padding: '4',
              bg: 'surface',
              borderBottom: '1px solid',
              borderRight: '1px solid',
              borderColor: 'border',
            })}
          >
            {client.logo ? (
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className={css({ maxHeight: '34px', width: 'auto', maxWidth: '100%' })}
              />
            ) : (
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  color: 'text',
                  textAlign: 'center',
                  maxWidth: '100%',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                })}
              >
                {client.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
