import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { hostOf } from './hostOf'

type Project = (typeof projects)[number]
type Client = NonNullable<Project['clients']>[number]

export function ClientLedger({ project }: { project: Project }) {
  const clients = project.clients ?? []
  return (
    <div className={css({ marginTop: '-6px' })}>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          bg: 'bg',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '4px',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontSize: '13px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          Clients of the house
        </span>
        <a
          href={`/work/${project.slug}`}
          className={css({
            fontFamily: 'display',
            fontSize: '13px',
            color: 'text',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            textDecoration: 'underline',
            textDecorationColor: 'accent',
            textUnderlineOffset: '0.18em',
          })}
        >
          case study →
        </a>
      </div>
      {clients.map((client) => (
        <ClientRow key={client.name} client={client} />
      ))}
    </div>
  )
}

export function ClientRow({ client }: { client: Client }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        paddingBlock: '14px',
        minHeight: '56px',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontWeight: 'normal',
          color: 'text',
          fontSize: 'clamp(18px, 1.6vw, 22px)',
          letterSpacing: '0.01em',
          flex: '1',
          minWidth: '0',
        })}
      >
        {client.name}
      </span>
      <ClientMark client={client} />
    </div>
  )
}

function ClientMark({ client }: { client: Client }) {
  if (client.logo) {
    return (
      // chip ground #f8fbff has no dark-scheme token; fieldInk (primary.50 in both schemes) is the nearest
      <span
        className={css({
          flex: '0 0 auto',
          bg: 'fieldInk',
          borderRadius: 'sm',
          height: '36px',
          minWidth: '72px',
          paddingInline: '11px',
          paddingBlock: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <img
          src={client.logo}
          alt={client.name}
          className={css({ height: '22px', width: 'auto', maxWidth: '104px', display: 'block' })}
        />
      </span>
    )
  }
  if (client.url) {
    // #d3e5f8 bright ink has no token; text is the nearest
    return (
      <span
        className={css({
          fontFamily: 'display',
          color: 'text',
          fontSize: '14px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          flex: '0 0 auto',
        })}
      >
        {hostOf(client.url)}
      </span>
    )
  }
  return null
}
