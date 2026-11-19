import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { PlateMeta } from './PlateMeta'

type Project = (typeof projects)[number]

// Ranges in content may carry a dash; render them in words.
function readText(source: object, key: string): string {
  const value: unknown = (source as Record<string, unknown>)[key]
  return typeof value === 'string' ? value.replace(/\s*[\u2014\u2013]\s*/g, ' to ') : ''
}

export function CaseHero({ project }: { project: Project }) {
  const rows = [
    { k: 'Year', v: String(project.year) },
    { k: 'Type', v: project.type },
    { k: 'Role', v: project.role ?? '' },
    { k: 'Timeline', v: readText(project, 'timeline') },
    { k: 'Status', v: readText(project, 'status') },
  ]
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'field',
        color: 'fieldInk',
        paddingInline: '6vw',
        paddingTop: { base: '40px', lg: '64px' },
        paddingBottom: { base: '48px', lg: '72px' },
      })}
    >
      <div
        className={css({
          display: { base: 'flex', lg: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          columnGap: '48px',
          alignItems: 'start',
        })}
      >
        <div
          className={css({
            gridColumn: { lg: '1 / 10' },
            display: 'flex',
            flexDirection: 'column',
            minWidth: '0',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
              borderBottom: '1px solid',
              borderColor: 'fieldBorder',
              paddingBottom: '3',
              marginBottom: '5',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            Case study · {project.type} · {project.year}
          </span>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: { base: '3xl', lg: '5xl', xl: 'hero' },
              lineHeight: '0.9',
              letterSpacing: '0.01em',
              color: 'fieldInk',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: { base: '1.5px currentColor', lg: '2.5px currentColor' },
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {project.title}
          </h1>
          {project.description && (
            <p
              className={css({
                fontSize: 'lede',
                lineHeight: 'normal',
                color: 'fieldInkMuted',
                maxWidth: '50ch',
                borderTop: '1px solid',
                borderColor: 'fieldBorder',
                paddingTop: '5',
                marginTop: '6',
                animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '160ms',
              })}
            >
              {project.description}
            </p>
          )}
        </div>
        <div
          className={css({
            gridColumn: { lg: '10 / 13' },
            marginTop: { base: '28px', lg: '4px' },
            minWidth: '0',
          })}
        >
          <PlateMeta rows={rows} />
        </div>
      </div>
    </section>
  )
}
