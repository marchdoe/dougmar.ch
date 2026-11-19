import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { SectionHead } from './SectionHead'

type Project = (typeof projects)[number]
type Client = NonNullable<Project['clients']>[number]

function LedgerRow({ client, index }: { client: Client; index: number }) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' })}>
      <span
        className={css({
          fontSize: '2xs',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: 'wider',
        })}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className={css({
          bg: 'fieldInk',
          border: '1px solid',
          borderColor: 'borderStrong',
          height: { base: '80px', lg: '92px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBlock: '14px',
          paddingInline: '4',
        })}
      >
        {client.logo ? (
          <img
            src={client.logo}
            alt={client.name}
            loading="lazy"
            className={css({
              display: 'block',
              maxHeight: { base: '34px', lg: '40px' },
              maxWidth: '86%',
              width: 'auto',
              height: 'auto',
            })}
          />
        ) : (
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'md',
              letterSpacing: '0.04em',
              color: 'field',
              textTransform: 'uppercase',
              textAlign: 'center',
              lineHeight: '1.02',
            })}
          >
            {client.name}
          </span>
        )}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: 'base', lg: 'md' },
          lineHeight: '1.05',
          letterSpacing: '0.03em',
          color: 'text',
        })}
      >
        {client.name}
      </span>
    </div>
  )
}

export function ClientLedger({ project }: { project: Project }) {
  const clients = project.clients ?? []
  if (clients.length === 0) return null
  return (
    <section
      id="clients"
      className={css({
        bg: 'bgAlt',
        color: 'text',
        paddingInline: '6vw',
        paddingTop: '6',
        paddingBottom: '40px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="Client ledger" tag={`${project.title} · ${project.year} to present`} />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
          gap: { base: '14px', sm: '4' },
          marginTop: '5',
        })}
      >
        {clients.map((c, i) => (
          <LedgerRow key={c.name} client={c} index={i} />
        ))}
      </div>
    </section>
  )
}
