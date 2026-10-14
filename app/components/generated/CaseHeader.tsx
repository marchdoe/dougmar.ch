import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

export function CaseHeader({ project }: { project: Proj }) {
  const meta = [String(project.year), project.type, project.role].filter((v): v is string =>
    Boolean(v)
  )
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: { base: '14px', lg: '52px' },
        paddingBottom: { base: '44px', lg: '56px' },
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
        display: 'flex',
        flexDirection: { base: 'column', lg: 'row' },
        alignItems: { base: 'flex-start', lg: 'baseline' },
        justifyContent: 'space-between',
        gap: '5',
      })}
    >
      <h1
        className={css({
          minWidth: '0',
          maxWidth: '100%',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: { base: '40px', md: '64px', lg: '104px' },
          lineHeight: 'tight',
          letterSpacing: 'tight',
          color: 'accent',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '4',
          rowGap: '1',
          flexShrink: 0,
        })}
      >
        {meta.map((m) => (
          <span
            key={m}
            className={css({
              fontSize: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'textMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {m}
          </span>
        ))}
      </div>
    </section>
  )
}
