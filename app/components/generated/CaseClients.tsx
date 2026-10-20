import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ClientRow } from './ClientLedger'

type Project = (typeof projects)[number]

export function CaseClients({ project }: { project: Project }) {
  const clients = project.clients ?? []
  if (clients.length === 0) return null
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '860px' })}>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '13px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
            paddingBottom: '12px',
          })}
        >
          Clients
        </h2>
        {clients.map((client) => (
          <ClientRow key={client.name} client={client} />
        ))}
      </div>
    </section>
  )
}
