import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

type Featured = NonNullable<typeof featuredProject>

function outboundHref(project: Featured) {
  return project.liveUrl ?? project.externalUrl ?? `/work/${project.slug}`
}

function FeaturedMeta({ project }: { project: Featured }) {
  const items = [project.type, String(project.year), project.status].filter(Boolean)
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: { base: 'row', md: 'column' },
        gap: { base: '26px', md: '8px' },
        textStyle: 'sm',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'textFaint',
        fontVariantNumeric: 'tabular-nums',
        borderTopWidth: { base: '1px', md: '0' },
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingTop: { base: '16px', md: '0' },
      })}
    >
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}

export function FeaturedSection() {
  const project = featuredProject
  if (!project) return null
  return (
    <section
      aria-labelledby="feat-title"
      className={css({
        bg: 'surface',
        paddingInline: 'clamp(28px,6vw,112px)',
        paddingBlock: 'clamp(48px,6vh,96px)',
        // From lg only: on a phone this section rests mid-fade under the hero, which thins the contrast of its small type.
        lg: {
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        },
      })}
    >
      <div
        className={css({
          textStyle: 'xs',
          fontWeight: 'bold',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'accent',
          marginBottom: '18px',
        })}
      >
        Featured
      </div>
      <div
        className={css({
          display: { base: 'flex', md: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { md: '1.2fr 1fr' },
          rowGap: { base: '24px', md: '32px' },
          columnGap: { md: '48px' },
          alignItems: { md: 'start' },
        })}
      >
        <h2
          id="feat-title"
          className={css({
            gridColumn: { md: '1 / -1' },
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            fontSize: 'clamp(52px,8vw,104px)',
            lineHeight: '0.9',
            letterSpacing: '0.01em',
            color: 'text',
          })}
        >
          {project.title}
        </h2>
        <div>
          <p
            className={css({
              fontSize: '16px',
              lineHeight: '1.55',
              color: 'textMuted',
              maxWidth: '56ch',
            })}
          >
            {project.problem ?? project.description}
          </p>
          <a
            href={outboundHref(project)}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              marginTop: '4px',
              color: 'text',
              fontSize: '15px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              _hover: { color: 'accent' },
            })}
          >
            <span
              className={css({
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'accent',
                paddingBottom: '2px',
              })}
            >
              View the {project.title} project →
            </span>
          </a>
        </div>
        <FeaturedMeta project={project} />
      </div>
    </section>
  )
}
