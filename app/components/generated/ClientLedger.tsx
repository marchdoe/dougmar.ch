import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ClientChips } from './ClientChips'

type Project = (typeof projects)[number]

export function ClientLedger({ project }: { project: Project | undefined }) {
  const clients = project?.clients ?? []
  if (clients.length === 0) return null
  return (
    <aside
      aria-label="Client roster"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        padding: 'clamp(24px, 3vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        gridColumn: { lg: '5 / 13' },
        gridRow: { lg: '3 / span 3' },
        alignSelf: { lg: 'start' },
        marginTop: { lg: 'clamp(150px, 20vh, 230px)' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
          paddingBottom: '16px',
        })}
      >
        <span
          className={css({
            fontSize: 'sm',
            color: 'fieldInkMuted',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          })}
        >
          The ledger · clients since {project?.year}
        </span>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'all-small-caps',
            letterSpacing: '0.04em',
            fontSize: '2xl',
            color: 'fieldInk',
            lineHeight: '1',
          })}
        >
          Who paid for the hustle
        </span>
      </div>
      <ClientChips clients={clients} />
      <p
        className={css({
          margin: '0',
          fontSize: 'sm',
          color: 'fieldInkMuted',
          lineHeight: '1.6',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          paddingTop: '16px',
          maxWidth: '50ch',
        })}
      >
        {clients.length} clients, one line in the balance book:{' '}
        <b className={css({ color: 'fieldInk' })}>the dream was free; the build was billable.</b>
      </p>
    </aside>
  )
}
