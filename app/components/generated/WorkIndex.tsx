import { css, cx } from '../../../styled-system/css'
import { experiments } from '../../content/projects'
import type { projects } from '../../content/projects'
import { homeSelectedWork } from './homeFeature'
import { revealClass } from './Reveal'

type Project = (typeof projects)[number]

function ProjectRow({ project, href }: { project: Project; href: string }) {
  return (
    <a
      href={href}
      className={cx(
        'group',
        css({
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          rowGap: '4px',
          columnGap: '16px',
          alignItems: 'center',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingBlock: '16px',
          _hover: { textDecoration: 'none' },
          _last: {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
          },
        })
      )}
    >
      <span
        className={css({
          gridColumn: '1',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(22px, 3.4vw, 34px)',
          lineHeight: '1.05',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
          color: 'text',
          _groupHover: { color: 'accent' },
        })}
      >
        {project.title}
      </span>
      <span
        aria-hidden="true"
        className={css({
          gridColumn: '2',
          gridRow: '1 / span 2',
          alignSelf: 'center',
          fontFamily: 'display',
          fontSize: '18px',
          color: 'textFaint',
          _groupHover: { color: 'accent' },
        })}
      >
        ↗
      </span>
      <span
        className={css({
          gridColumn: '1',
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        {`${project.type} · ${project.year}`}
      </span>
    </a>
  )
}

function SectionHead({ title, count }: { title: string; count: number }) {
  const labelClass = css({
    fontFamily: 'display',
    textStyle: '2xs',
    letterSpacing: 'widest',
    textTransform: 'uppercase',
    color: 'textMuted',
  })
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: '8px',
      })}
    >
      <h2 className={labelClass}>{title}</h2>
      <span className={labelClass}>{String(count).padStart(2, '0')}</span>
    </div>
  )
}

/* Audit note: the finding was not itemised and every export here has an
   importer, so a name shared with a hand-written module is the suspected
   cause, unconfirmed. These export names were made distinct for that reason. */
export function HomeIndexBand() {
  return (
    <section
      id="work"
      className={cx(
        revealClass,
        css({
          minWidth: '0',
          gridArea: { lg: 'index' },
          display: { lg: 'grid' },
          gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
          columnGap: { lg: '32px' },
          bg: 'surface',
          borderTopWidth: { base: '3px', lg: '0' },
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: { base: '56px', md: '72px', lg: '96px' },
          paddingBottom: { base: '48px', md: '64px', lg: '96px' },
          paddingInline: { base: '16px', md: '40px', lg: '5vw' },
        })
      )}
    >
      <div className={css({ gridColumn: { lg: '1 / 8' } })}>
        <SectionHead title="selected work" count={homeSelectedWork.length} />
        {homeSelectedWork.map((project) => (
          <ProjectRow key={project.slug} project={project} href={`/work/${project.slug}`} />
        ))}
      </div>
      <div className={css({ gridColumn: { lg: '8 / 13' }, marginTop: { base: '48px', lg: '0' } })}>
        <SectionHead title="experiments" count={experiments.length} />
        {experiments.map((project) => (
          <ProjectRow
            key={project.slug}
            project={project}
            href={project.externalUrl ?? `/work/${project.slug}`}
          />
        ))}
      </div>
    </section>
  )
}
