import { css } from '../../../styled-system/css'
import type { featuredProject } from '../../content/projects'
import { bleed, Label, track } from './LedgerParts'

type Featured = NonNullable<typeof featuredProject>

const band = css({
  bg: 'field',
  color: 'fieldInk',
  paddingTop: { base: '28px', md: '40px' },
  paddingBottom: { base: '20px', md: '36px' },
  rowGap: '20px',
  alignItems: { md: 'start' },
  minHeight: { md: '240px' },
})

/* The size is set against the title track, not the viewport: 44px at 360 and 128px at 1440,
   as the mockup has it, and scaled to the track's width at every width between. */
const title = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: 'hero',
  fontSize: {
    base: 'clamp(44px, 12.2vw, 72px)',
    md: 'calc(13.9vw - 34px)',
    lg: 'clamp(80px, calc(10vw - 16px), 128px)',
  },
  lineHeight: '0.94',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  minWidth: 0,
})

const titleLink = css({
  display: 'inline-block',
  textDecoration: 'none',
  color: 'fieldInk',
  transition: 'color 120ms',
  '&:hover': { color: 'fieldInkMuted' },
  '&:focus-visible': { color: 'fieldInkMuted', outlineColor: 'fieldInk' },
})

const say = css({
  marginTop: '12px',
  textStyle: 'lede',
  lineHeight: '1.5',
  color: 'fieldInk',
  maxWidth: '46ch',
})

/* The mockup sets the client names at 15px, between the sm and base steps. */
const clientList = css({
  listStyle: 'none',
  marginTop: '12px',
  marginBottom: '0px',
  paddingTop: '12px',
  paddingLeft: '0px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'fieldBorder',
  textStyle: 'sm',
  fontSize: '15px',
  lineHeight: '1.55',
  color: 'fieldInk',
  fontWeight: 'normal',
})

const visit = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginTop: '4px',
  textStyle: 'sm',
  fontWeight: 'bold',
  color: 'fieldInk',
  textDecorationColor: 'fieldInk',
  '&:hover': { color: 'fieldInkMuted', textDecorationColor: 'fieldInkMuted' },
  '&:focus-visible': { outlineColor: 'fieldInk' },
})

function BandMeta({ project }: { project: Featured }) {
  const clients = project.clients ?? []
  const href = project.externalUrl ?? project.liveUrl
  return (
    <div className={css({ minWidth: 0, paddingTop: { md: '6px' } })}>
      <Label onField parts={[String(project.year), project.role]} />
      <ul className={clientList}>
        {clients.map((client) => (
          <li key={client.name}>{client.name}</li>
        ))}
      </ul>
      {href ? (
        <a className={visit} href={href}>
          Visit {project.title} ↗
        </a>
      ) : null}
    </div>
  )
}

export function FeaturedBand({ project }: { project: Featured }) {
  const statement = project.problem ?? project.description
  return (
    <article className={`${bleed} ${track} ${band}`}>
      <div className={css({ minWidth: 0 })}>
        <h2 className={title}>
          <a href={`/work/${project.slug}`} className={titleLink}>
            {project.title}
          </a>
        </h2>
        {statement ? <p className={say}>{statement}</p> : null}
      </div>
      <BandMeta project={project} />
    </article>
  )
}
