import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function extra(p: Project, key: string): string {
  const v = (p as unknown as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

export function CaseHero({ project }: { project: Project }) {
  const clients = (project.clients ?? []).map((c) => c.name).join(', ')
  const meta: [string, string][] = [
    ['Year', String(project.year)],
    ['Type', project.type],
    ['Role', project.role ?? ''],
    ['Timeline', extra(project, 'timeline')],
    ['Status', extra(project, 'status')],
    ['Clients', clients],
  ]
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        marginInline: { base: '-16px', md: '-32px', lg: '-6vw', xl: '-7vw' },
        paddingInline: { base: '16px', md: '32px', lg: '6vw', xl: '7vw' },
        paddingTop: { base: '28px', md: '40px' },
        paddingBottom: { base: '32px', md: '44px' },
        display: { base: 'block', md: 'grid' },
        gridTemplateColumns: { md: 'repeat(12, minmax(0, 1fr))' },
        columnGap: { md: '24px' },
        alignItems: 'end',
      })}
    >
      <h1
        className={css({
          gridColumn: { md: '1 / 9' },
          fontFamily: 'display',
          fontWeight: 'normal',
          fontVariant: 'small-caps',
          fontSize: { base: '44px', md: 'clamp(48px, 6.4vw, 104px)' },
          lineHeight: '0.94',
          color: 'fieldInk',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <dl
        className={css({
          gridColumn: { md: '9 / 13' },
          marginTop: { base: '20px', md: '0' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {meta
          .filter(([, v]) => v !== '')
          .map(([k, v]) => (
            <div
              key={k}
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                gap: '3',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'fieldBorder',
                paddingBlock: '8px',
              })}
            >
              <dt
                className={css({
                  fontSize: 'sm',
                  fontWeight: 'bold',
                  fontVariantCaps: 'all-small-caps',
                  letterSpacing: 'wide',
                  color: 'fieldInkMuted',
                })}
              >
                {k}
              </dt>
              <dd
                className={css({
                  margin: '0',
                  fontSize: 'sm',
                  color: 'fieldInk',
                  textAlign: 'right',
                })}
              >
                {v}
              </dd>
            </div>
          ))}
      </dl>
    </section>
  )
}
