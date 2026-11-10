import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Reveal } from './Reveal'

type Project = (typeof projects)[number]

function rowHref(project: Project): string {
  if (project.depth === 'lightweight' && project.externalUrl) return project.externalUrl
  return `/work/${project.slug}`
}

function IndexRow({ project }: { project: Project }) {
  return (
    <a
      href={rowHref(project)}
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gridTemplateAreas: '"title year" "meta meta"',
        rowGap: '2px',
        columnGap: '16px',
        alignItems: 'baseline',
        paddingTop: '20px',
        paddingBottom: '18px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      <span
        className={css({
          gridArea: 'title',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(26px, 5vw, 42px)',
          lineHeight: '1',
          letterSpacing: '-0.01em',
          color: 'text',
          transition: 'color 0.18s ease',
          'a:hover &': { color: 'accent' },
        })}
      >
        {project.title}
      </span>
      <span
        className={css({
          gridArea: 'year',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(18px, 3vw, 26px)',
          fontVariantNumeric: 'tabular-nums',
          color: 'textFaint',
          transition: 'color 0.18s ease',
          'a:hover &': { color: 'accent' },
        })}
      >
        {project.year}
      </span>
      <span
        className={css({
          gridArea: 'meta',
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'accent',
          marginTop: '6px',
        })}
      >
        {project.type}
      </span>
    </a>
  )
}

// The reveal sits on the heading alone. A view() entry range scales with the height of
// its subject, so on the whole list the small labels stayed near transparent in view.
function IndexHead({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <Reveal>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            textTransform: 'lowercase',
            fontSize: 'clamp(24px, 4vw, 34px)',
            letterSpacing: '0.01em',
            color: 'text',
            marginBottom: '6px',
          })}
        >
          {title}
        </h2>
      </Reveal>
      <p
        className={css({
          textStyle: 'sm',
          fontWeight: 'bold',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'textMuted',
          marginBottom: '28px',
        })}
      >
        {sub}
      </p>
    </>
  )
}

function IndexRows({ items }: { items: Project[] }) {
  return (
    <div
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      {items.map((project) => (
        <IndexRow key={project.slug} project={project} />
      ))}
    </div>
  )
}

export function WorkIndex({ work, lab }: { work: Project[]; lab: Project[] }) {
  return (
    <section
      id="work"
      className={css({
        paddingBlock: 'clamp(44px, 6vw, 88px)',
        paddingInline: 'clamp(16px, 5vw, 80px)',
      })}
    >
      <IndexHead title="Selected Work" sub="Four projects · 2018–2026" />
      <IndexRows items={work} />
      <div className={css({ marginTop: 'clamp(40px, 5vw, 64px)' })}>
        <IndexHead title="Experiments" sub="Things built to learn something" />
      </div>
      <IndexRows items={lab} />
    </section>
  )
}
