import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { PlateMeta } from './PlateMeta'

type Project = (typeof projects)[number]

const linkClass = css({
  display: 'inline-block',
  color: { base: 'accent', _light: 'fieldInk' },
  borderBottom: '1px solid',
  borderColor: 'accentAlt',
  paddingBlock: '10px',
  marginRight: '4',
  whiteSpace: 'nowrap',
})

const fieldSection = css({
  position: 'relative',
  bg: 'field',
  color: 'fieldInk',
  paddingInline: '6vw',
  paddingTop: { base: '40px', lg: '64px' },
  paddingBottom: { base: '48px', lg: '72px' },
  minHeight: { base: '72vh', lg: '84vh' },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

const captionClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: { base: '2xl', lg: '86px' },
  lineHeight: '0.96',
  color: 'fieldInk',
  maxWidth: { base: '16ch', lg: '14ch' },
  marginTop: '1',
  marginBottom: '5',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function HeroPhrase() {
  return (
    <section className={fieldSection}>
      <h1 className={captionClass}>Design and build on the same desk.</h1>
    </section>
  )
}

export function HeroArtifact({ project }: { project: Project }) {
  const external = project.externalUrl ?? project.liveUrl
  const rows = [
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: project.role ?? '' },
    { k: 'Scope', v: 'Design + Build' },
  ]
  return (
    <section className={fieldSection}>
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
              animationDelay: '240ms',
            })}
          >
            {project.title} · {project.type} ·{' '}
            <b
              className={css({ color: { base: 'accent', _light: 'fieldInk' }, fontWeight: 'bold' })}
            >
              Est. {project.year}
            </b>
          </span>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: { base: '4xl', lg: '156px' },
              lineHeight: '0.9',
              letterSpacing: '0.01em',
              color: 'fieldInk',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: { base: '1.5px currentColor', lg: '2.5px currentColor' },
              marginBottom: '6px',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            {project.title}
          </h2>
          <h1 className={captionClass}>Design and build on the same desk.</h1>
          <p
            className={css({
              fontSize: 'lede',
              lineHeight: 'normal',
              color: 'fieldInkMuted',
              maxWidth: '50ch',
              borderTop: '1px solid',
              borderColor: 'fieldBorder',
              paddingTop: '5',
              marginTop: '5',
              animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            {project.problem ?? project.description}{' '}
            <a href={`/work/${project.slug}`} className={linkClass}>
              Read the case
            </a>
            {external && (
              <a href={external} className={linkClass}>
                Visit {project.title}
              </a>
            )}
          </p>
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
