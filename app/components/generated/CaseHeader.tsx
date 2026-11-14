import { css } from '../../../styled-system/css'
import { type Project, field } from './projectFields'
import { Sky } from './Sky'
import { SkyMasthead } from './SkyMasthead'

function caseMeta(project: Project) {
  const clients = (project.clients ?? []).map((c) => c.name).join(', ')
  return [
    { k: 'Type', v: project.type },
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: field(project, 'role') },
    { k: 'Timeline', v: field(project, 'timeline') },
    { k: 'Status', v: field(project, 'status') },
    { k: 'Clients', v: clients },
  ].filter((m) => m.v !== '')
}

export function CaseHeader({ project }: { project: Project }) {
  return (
    <Sky>
      <SkyMasthead />
      <div
        className={css({
          marginTop: '48px',
          marginBottom: '8px',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1.6fr 1fr' },
          gap: { base: '24px', lg: '56px' },
          alignItems: { lg: 'end' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: { base: '3xl', lg: '5xl' },
            lineHeight: '1',
            letterSpacing: '-0.02em',
            color: 'text',
            minWidth: '0',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <dl
          className={css({
            margin: '0',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '32px',
            rowGap: '12px',
            justifyContent: { lg: 'flex-end' },
            textAlign: { lg: 'right' },
          })}
        >
          {caseMeta(project).map((m) => (
            <div
              key={m.k}
              className={css({ display: 'flex', flexDirection: 'column', gap: '3px' })}
            >
              <dt
                className={css({
                  textStyle: '2xs',
                  textTransform: 'uppercase',
                  letterSpacing: 'wider',
                  fontWeight: 'bold',
                  color: 'text',
                })}
              >
                {m.k}
              </dt>
              {/* text, not textMuted: this line sits over the sky gradient and must clear 4.5:1 along it */}
              <dd className={css({ margin: '0', textStyle: 'sm', color: 'text' })}>{m.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Sky>
  )
}
