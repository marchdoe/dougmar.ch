import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Client = NonNullable<Project['clients']>[number]

// The marks are drawn for a light ground; the dark scheme flips them so they stay legible.
const markBase = css({
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'contain',
  filter: { base: 'invert(1) hue-rotate(180deg)', _light: 'none' },
})
const defaultHeight = css({ height: '32px' })
const MARK_HEIGHT: Record<string, string> = {
  Rolex: css({ height: '50px' }),
  'The Nature Conservancy': css({ height: '46px' }),
  'Sapient Razorfish': css({ height: '24px' }),
  Intuit: css({ height: '24px' }),
  LastPass: css({ height: '24px' }),
}

function ClientMark({ client }: { client: Client }) {
  return (
    <li
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '52px',
        width: '100%',
        fontFamily: 'display',
        fontWeight: 'bold',
        fontSize: '20px',
        letterSpacing: '-0.01em',
        textAlign: 'center',
        color: 'text',
      })}
    >
      {client.logo ? (
        <img
          src={client.logo}
          alt={client.name}
          loading="lazy"
          className={cx(markBase, MARK_HEIGHT[client.name] ?? defaultHeight)}
        />
      ) : (
        client.name
      )}
    </li>
  )
}

function ClientOwner({ project }: { project: Project }) {
  const site = project.externalUrl ?? project.liveUrl
  const owner = css({
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: { base: '44px', lg: 'auto' },
    color: 'text',
    fontWeight: 'bold',
  })
  return site ? (
    <a href={site} className={owner}>
      {project.title}
    </a>
  ) : (
    <b className={owner}>{project.title}</b>
  )
}

export function ClientSet({ project }: { project?: Project }) {
  const clients = project?.clients ?? []
  if (!project || clients.length === 0) return null
  return (
    <section
      aria-label={`${project.title} clients`}
      className={css({
        bg: 'surface',
        paddingBlock: '36px',
        paddingInline: 'clamp(16px, 5vw, 80px)',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
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
        <ClientOwner project={project} />. Selected clients, {project.year} to present
      </p>
      <ul
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          rowGap: '34px',
          columnGap: '40px',
          alignItems: 'center',
          justifyItems: 'center',
        })}
      >
        {clients.map((client) => (
          <ClientMark key={client.name} client={client} />
        ))}
      </ul>
    </section>
  )
}
