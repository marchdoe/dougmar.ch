import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Client = NonNullable<(typeof projects)[number]['clients']>[number]

export function ClientTile({ client }: { client: Client }) {
  return (
    <div
      className={css({
        bg: 'bgAlt',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'sm',
        paddingTop: '3',
        paddingInline: '2',
        paddingBottom: '2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '66px',
        gap: '2',
      })}
    >
      {client.logo ? (
        <>
          <img
            src={client.logo}
            alt={client.name}
            className={css({
              maxHeight: '22px',
              maxWidth: '82%',
              width: 'auto',
              height: 'auto',
              display: 'block',
            })}
          />
          <span
            className={css({
              fontSize: '2xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'textMuted',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1.2',
            })}
          >
            {client.name}
          </span>
        </>
      ) : (
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'base',
            color: 'text',
            textAlign: 'center',
          })}
        >
          {client.name}
        </span>
      )}
    </div>
  )
}
