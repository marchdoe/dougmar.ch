import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ClientTile } from './ClientTile'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

export function CaseHeader({ project }: { project: CaseProject }) {
  const facts = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
  ].filter((f) => Boolean(f.value))
  const clients = project.clients ?? []
  return (
    <div
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(14px, 3vw, 24px)',
        paddingBottom: 'clamp(24px, 4vw, 44px)',
      })}
    >
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
          marginBottom: '0.6em',
        })}
      >
        Case study
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: '36px', sm: '48px', lg: '5xl' },
          lineHeight: '0.92',
          letterSpacing: '0.015em',
          color: 'text',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          marginTop: '5',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '2',
        })}
      >
        {facts.map((f) => (
          <div
            key={f.label}
            className={css({
              bg: 'bgAlt',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'sm',
              padding: '3',
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
            })}
          >
            <span
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              {f.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'base',
                color: 'text',
              })}
            >
              {f.value}
            </span>
          </div>
        ))}
        {clients.map((c) => (
          <ClientTile key={c.name} client={c} />
        ))}
      </div>
    </div>
  )
}
