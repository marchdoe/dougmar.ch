import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function FeatureCopy({ project }: { project: Project }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      <p
        className={css({
          fontSize: '15px',
          lineHeight: '1.5',
          color: 'fieldInkMuted',
          maxWidth: { base: '46ch', xl: '42ch' },
          textAlign: 'right',
        })}
      >
        {project.description ?? project.problem}
      </p>
      <a
        href={`/work/${project.slug}`}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: { base: '44px', lg: 'auto' },
          marginTop: { base: '2px', lg: '16px' },
          fontSize: '13px',
          fontWeight: 'bold',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'fieldInk',
        })}
      >
        <span
          className={css({
            paddingBottom: '3px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
          })}
        >
          Read the case ↗
        </span>
      </a>
    </div>
  )
}

function FeatureField({ project }: { project: Project }) {
  return (
    <div
      className={css({
        bg: 'field',
        color: 'fieldInk',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { base: 'flex-end', lg: 'center' },
        minHeight: { lg: '88vh' },
        paddingTop: { base: '20px', lg: '48px' },
        paddingBottom: { base: '12px', lg: '64px' },
        paddingInline: { base: '14px', lg: 'clamp(32px, 4vw, 64px)' },
        borderColor: 'borderStrong',
        borderBottomStyle: 'solid',
        borderBottomWidth: { base: '1px', lg: '0' },
        borderRightStyle: 'solid',
        borderRightWidth: { base: '0', lg: '1px' },
      })}
    >
      <p
        className={css({
          textStyle: 'sm',
          fontWeight: 'bold',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          textAlign: 'right',
          marginBottom: { base: '10px', lg: '24px' },
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {project.title} LLC · Founded {project.year}
      </p>
      <div
        className={css({
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontSize: 'clamp(64px, 10vw, 148px)',
            lineHeight: '0.9',
            letterSpacing: '-0.015em',
            color: 'fieldInk',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            marginBottom: { base: '12px', lg: '28px' },
          })}
        >
          {project.title}
        </h2>
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            textTransform: 'lowercase',
            fontSize: 'clamp(17px, 2.4vw, 22px)',
            letterSpacing: '0.04em',
            color: 'fieldInk',
            textAlign: 'right',
            marginBottom: { base: '12px', lg: '18px' },
          })}
        >
          {project.year} · {project.type}
        </p>
      </div>
      <FeatureCopy project={project} />
    </div>
  )
}

function Caption() {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: { base: 'flex-end', lg: 'flex-start' },
        paddingTop: { base: '16px', lg: 'calc(42vh + 32px)' },
        paddingRight: { base: '14px', lg: 'clamp(28px, 3vw, 52px)' },
        paddingBottom: { base: '40px', lg: '56px' },
        paddingLeft: { base: '14px', lg: 'clamp(20px, 2.4vw, 32px)' },
      })}
    >
      <h1
        className={css({
          textStyle: '2xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: { base: 'clamp(28px, 6.6vw, 30px)', lg: 'clamp(30px, 3vw, 44px)' },
          lineHeight: { base: '1.04', lg: '1' },
          color: 'text',
          textAlign: { base: 'right', lg: 'left' },
          maxWidth: { base: '18ch', lg: '15ch' },
          marginLeft: { base: 'auto', lg: '0' },
          marginRight: { lg: 'auto' },
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Designed and shipped by the same hands.
      </h1>
    </div>
  )
}

export function HomeHero({ project }: { project?: Project }) {
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.55fr 1fr' },
        marginTop: { lg: '-128px' },
      })}
    >
      {project ? <FeatureField project={project} /> : null}
      <Caption />
    </section>
  )
}
