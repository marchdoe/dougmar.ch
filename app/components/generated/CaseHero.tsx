import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Ground } from '../Material'

type Project = (typeof projects)[number]

export function CaseHero({ project }: { project: Project }) {
  const caption = [String(project.year), project.role, project.type].filter(Boolean).join(' · ')

  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'surface',
        marginTop: 'calc(var(--tab) * -1)',
        paddingTop: { base: '108px', lg: '140px' },
        paddingBottom: '56px',
        paddingInline: 'var(--pad)',
      })}
    >
      <Ground material="grain" seed={1533375130} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          width: 'fit-content',
          maxWidth: '100%',
          marginLeft: 'auto',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            textStyle: { base: '3xl', lg: 'hero' },
            color: 'fieldInk',
            textAlign: 'right',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            marginTop: '3',
            textStyle: 'sm',
            fontWeight: 'bold',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'surface',
            textAlign: 'justify',
            textAlignLast: 'justify',
          })}
        >
          {caption}
        </div>
      </div>
    </section>
  )
}
