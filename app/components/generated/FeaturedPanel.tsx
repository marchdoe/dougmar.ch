import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { VisitLink } from './VisitLink'

type Project = (typeof projects)[number]

export const MARQUEE_SLUG = '15th-club'

const marqueeProject = projects.find((project) => project.slug === MARQUEE_SLUG)

function FeaturedHead({ project }: { project: Project }) {
  return (
    <div>
      <div
        className={css({
          textStyle: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'fieldInk',
        })}
      >
        {['Featured', project.status].filter(Boolean).join(' · ')}
      </div>
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: { base: 'clamp(56px,9vw,120px)', lg: 'clamp(56px,8.4vw,120px)' },
          lineHeight: '0.9',
          fontWeight: 'normal',
          letterSpacing: '0.01em',
          textTransform: 'lowercase',
          fontVariant: 'small-caps',
          color: 'fieldInk',
        })}
      >
        {project.title}
      </h2>
    </div>
  )
}

function FeaturedCopy({ project }: { project: Project }) {
  return (
    <>
      {project.description && (
        <p
          className={css({
            fontSize: 'clamp(19px,5.4vw,26px)',
            lineHeight: '1.18',
            fontWeight: 'normal',
            maxWidth: '22ch',
            color: 'fieldInk',
          })}
        >
          {project.description}
        </p>
      )}
      {project.problem && (
        <p
          className={css({
            fontSize: '15px',
            lineHeight: '1.55',
            maxWidth: '52ch',
            color: 'fieldInk',
            textAlign: 'left',
          })}
        >
          {project.problem}
        </p>
      )}
    </>
  )
}

function FeaturedFoot({ project }: { project: Project }) {
  const meta = [String(project.year), project.type, project.role].filter(Boolean)
  const url = project.externalUrl ?? project.liveUrl
  return (
    <>
      <div
        className={css({
          display: 'flex',
          gap: '14px',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          width: '100%',
          paddingTop: '14px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        {meta.map((item) => (
          <span
            key={item}
            className={css({
              textStyle: '2xs',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: '600',
              color: 'fieldInk',
            })}
          >
            {item}
          </span>
        ))}
      </div>
      {url && <VisitLink url={url} />}
    </>
  )
}

export function FeaturedPanel() {
  if (!marqueeProject) return null
  return (
    <article
      className={css({
        bg: { base: 'accent', _dark: 'field' },
        color: 'fieldInk',
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: { lg: 'space-between' },
        gap: { base: '14px', lg: '22px' },
        paddingTop: { base: '28px', md: '34px', lg: '38px' },
        paddingBottom: { base: '32px', md: '40px', lg: '42px' },
        paddingInline: { base: '20px', md: '48px', lg: '44px' },
        gridColumn: { lg: '6 / 13' },
        gridRow: { lg: '2 / 7' },
      })}
    >
      <FeaturedHead project={marqueeProject} />
      <FeaturedCopy project={marqueeProject} />
      <FeaturedFoot project={marqueeProject} />
    </article>
  )
}
