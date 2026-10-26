import type { featuredProject as FeaturedRef, projects } from '../../content/projects'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { css } from '../../../styled-system/css'
import { tile } from './TileStyles'

type Project = (typeof projects)[number]
type Tone = 'brass' | 'dark' | 'paper' | 'paper2' | 'brass2'
type Span = 'one' | 'two' | 'three'
type Featured = NonNullable<typeof FeaturedRef>

const TONES: Tone[] = ['brass', 'dark', 'paper2', 'brass2', 'paper', 'paper2']
const SPANS: Span[] = ['two', 'two', 'one', 'two', 'one', 'one']
const SPLIT_AT: Record<string, number> = {
  spaceman: 5,
  fishsticks: 4,
  'dougmar-ch': 4,
  teeturn: 3,
  politweets: 4,
  twittertale: 7,
}

function titleParts(slug: string, title: string): string[] {
  if (title.includes(' ')) return title.split(' ')
  const at = SPLIT_AT[slug] ?? 0
  return at > 0 && at < title.length ? [title.slice(0, at), title.slice(at)] : [title]
}

function StackedTitle({ slug, title }: { slug: string; title: string }) {
  return (
    <h2
      data-part="title"
      className={css({
        position: 'relative',
        fontFamily: 'display',
        fontWeight: 'bold',
        fontSize: 'clamp(38px, 9vw, 128px)',
        lineHeight: '0.82',
        fontVariant: 'small-caps',
        letterSpacing: 'wide',
        textAlign: 'left',
        hyphens: 'none',
        transition: 'color 0.18s ease',
      })}
    >
      {titleParts(slug, title).map((part) => (
        <span key={part} className={css({ display: 'block' })}>
          {part}
        </span>
      ))}
    </h2>
  )
}

function TileMeta({ label, year }: { label: string; year: number }) {
  return (
    <div
      data-part="meta"
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '3',
        flexWrap: 'wrap',
        paddingTop: '3',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        textStyle: 'sm',
        letterSpacing: 'wider',
        textTransform: 'uppercase',
      })}
    >
      <span data-part="role" className={css({ fontWeight: 'bold' })}>
        {label}
      </span>
      <span data-part="yr" className={css({ fontVariantNumeric: 'tabular-nums' })}>
        {year}
      </span>
    </div>
  )
}

function featuredHref(p: Featured): string {
  return p.externalUrl ?? p.liveUrl ?? `/work/${p.slug}`
}

function featureTag(role: string | undefined): string {
  return role ? `${role} · Featured` : 'Featured'
}

function FeaturedCopy({ project }: { project: Featured }) {
  return (
    <div
      className={css({ position: 'relative', display: 'flex', flexDirection: 'column', gap: '3' })}
    >
      {project.description ? (
        <p
          className={css({
            fontSize: '15px',
            lineHeight: 'normal',
            color: 'fieldInk',
            maxWidth: '40ch',
          })}
        >
          {project.description}
        </p>
      ) : null}
      {project.problem ? (
        <p
          className={css({
            textStyle: 'sm',
            lineHeight: 'loose',
            color: 'fieldInkMuted',
            maxWidth: '40ch',
          })}
        >
          {project.problem}
        </p>
      ) : null}
    </div>
  )
}

function FeaturedTile({ project }: { project: Featured }) {
  return (
    <article className={tile({ tone: 'dark', span: 'three' })}>
      <div
        className={css({
          fontSize: '13px',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
        })}
      >
        {featureTag(project.role)}
      </div>
      <StackedTitle slug={project.slug} title={project.title} />
      <FeaturedCopy project={project} />
      <TileMeta label={project.role ?? project.type} year={project.year} />
      <a
        href={featuredHref(project)}
        className={css({
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontSize: '13px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
        })}
      >
        Open case →
      </a>
    </article>
  )
}

function Tile({ project, index }: { project: Project; index: number }) {
  const tone = TONES[index % TONES.length] ?? 'paper'
  const span = SPANS[index % SPANS.length] ?? 'one'
  return (
    <a href={`/work/${project.slug}`} className={tile({ tone, span })}>
      <StackedTitle slug={project.slug} title={project.title} />
      {project.description ? (
        <p
          className={css({
            position: 'relative',
            textStyle: 'sm',
            lineHeight: 'normal',
            color: 'inherit',
            maxWidth: '42ch',
          })}
        >
          {project.description}
        </p>
      ) : null}
      <TileMeta label={project.type} year={project.year} />
    </a>
  )
}

export function WorkIndex() {
  const rest = [...selectedWork, ...experiments]
  return (
    <section
      aria-label="Selected work and experiments"
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
        },
        gridAutoRows: { lg: 'minmax(118px, auto)' },
        gridAutoFlow: { lg: 'dense' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {featuredProject ? <FeaturedTile project={featuredProject} /> : null}
      {rest.map((p, i) => (
        <Tile key={p.slug} project={p} index={i} />
      ))}
    </section>
  )
}
