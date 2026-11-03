import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function WorkHeader({ project, showLabels }: { project: Project; showLabels: boolean }) {
  const labels = [
    project.type,
    String(project.year),
    project.role,
    project.timeline,
    project.status,
  ].filter(Boolean)
  return (
    <header
      className={css({
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: 'repeat(12, minmax(0, 1fr))' },
        columnGap: { lg: '24px' },
        rowGap: '18px',
        alignItems: { lg: 'end' },
        textAlign: 'right',
        paddingTop: { base: '32px', md: '48px' },
        paddingBottom: { base: '28px', md: '40px' },
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: {
            base: 'clamp(40px,11vw,64px)',
            md: 'clamp(64px,10vw,110px)',
            lg: 'clamp(72px,9vw,150px)',
          },
          lineHeight: '0.92',
          fontWeight: 'normal',
          letterSpacing: '0.01em',
          textTransform: 'lowercase',
          fontVariant: 'small-caps',
          color: 'text',
          gridColumn: { lg: '4 / 13' },
          gridRow: { lg: '1' },
        })}
      >
        {project.title}
      </h1>
      {showLabels && (
        <div
          className={css({
            display: 'flex',
            flexDirection: { base: 'row', lg: 'column' },
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: { lg: 'flex-start' },
            gap: { base: '14px', lg: '6px' },
            textAlign: { lg: 'left' },
            gridColumn: { lg: '1 / 4' },
            gridRow: { lg: '1' },
          })}
        >
          {labels.map((label) => (
            <span
              key={label}
              className={css({
                textStyle: 'sm',
                letterSpacing: 'wide',
                fontWeight: '600',
                color: 'textMuted',
              })}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}
