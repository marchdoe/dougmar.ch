import type { projects } from '../../content/projects'
import { css } from '../../../styled-system/css'
import { field } from './fields'

type Proj = (typeof projects)[number]

export function CaseHero({ project }: { project: Proj }) {
  const meta = [
    { label: 'year', value: String(project.year) },
    { label: 'role', value: field(project, 'role') },
    { label: 'type', value: project.type },
  ].filter((m) => m.value)
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '24px', sm: '6vw' },
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          left: '-10%',
          right: '-10%',
          top: '26%',
          height: '48%',
          bg: 'field',
          transform: { sm: 'rotate(-6deg)' },
          zIndex: -1,
        })}
      />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          columnGap: '7',
          rowGap: '4',
        })}
      >
        <h1
          className={css({
            textStyle: { base: '3xl', md: '4xl', xl: 'hero' },
            fontFamily: 'display',
            fontWeight: 'normal',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            textTransform: 'lowercase',
            color: 'fieldInk',
            minWidth: '0',
            maxWidth: '100%',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {meta.map((m) => (
            <span
              key={m.label}
              className={css({
                textStyle: { base: 'lg', lg: 'xl' },
                fontFamily: 'display',
                color: 'text',
                textTransform: 'lowercase',
              })}
            >
              {m.value}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
