import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { ClientChips } from './ClientChips'

const seen = new Set<string>()
const allClients = projects
  .flatMap((p) => p.clients ?? [])
  .filter((c) => {
    const fresh = !seen.has(c.name)
    seen.add(c.name)
    return fresh
  })

export function HomeClients() {
  return (
    <section
      aria-label="Clients across the work"
      className={css({
        gridArea: { lg: 'clients' },
        bg: 'surface',
        paddingTop: { base: '12px', lg: '8px' },
        paddingBottom: { base: '44px', lg: '56px' },
        paddingLeft: { base: '20px', lg: '5vw' },
        paddingRight: { base: '20px', lg: '0' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Clients and partners across the work
      </span>
      <ClientChips clients={allClients} lazy />
    </section>
  )
}
