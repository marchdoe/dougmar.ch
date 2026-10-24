import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Pod } from './Pod'
import { rangeText, textField } from './projectFields'

type Item = (typeof projects)[number]

export function CaseHero({ project }: { project: Item }) {
  const meta = [
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: rangeText(textField(project, 'timeline')) },
    { label: 'Status', value: textField(project, 'status') },
  ].filter((m) => m.value !== '')
  return (
    <section
      className={css({
        paddingTop: '6',
        paddingBottom: '8',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '5',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
          lineHeight: '0.95',
          letterSpacing: '-0.01em',
          textAlign: 'center',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <p
        className={css({
          textStyle: 'lede',
          color: 'textMuted',
          maxWidth: '44ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {project.description ?? `${project.type}, ${project.year}`}
      </p>
      <Pod
        label="Year"
        value={String(project.year)}
        solid
        className={css({
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      />
      <dl
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          rowGap: '4',
          columnGap: '6',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      >
        {meta.map((m) => (
          <div
            key={m.label}
            className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}
          >
            <dt
              className={css({
                textStyle: '2xs',
                fontWeight: 'bold',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              {m.label}
            </dt>
            <dd className={css({ textStyle: 'sm', fontWeight: 'bold', color: 'text' })}>
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
