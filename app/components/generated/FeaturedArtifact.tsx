import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ArtifactHead } from './ArtifactHead'
import { ClientLedger } from './ClientLedger'
import { hostOf } from './hostOf'

type Project = (typeof projects)[number]

export function FeaturedArtifact({ project }: { project?: Project }) {
  return (
    <div>
      {project ? <ArtifactHead project={project} /> : null}
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          color: 'text',
          fontSize: 'clamp(26px, 3.4vw, 42px)',
          lineHeight: '1.12',
          letterSpacing: '-0.01em',
          maxWidth: '22ch',
          marginBottom: 'clamp(20px, 3vw, 32px)',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Closing the gap between what gets designed and what gets built.
      </h1>
      {project ? <ArtifactBody project={project} /> : null}
    </div>
  )
}

function ArtifactBody({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl
  return (
    <>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'clamp(16px, 1.3vw, 18px)',
          color: 'textMuted',
          bg: 'bg',
          width: 'fit-content',
          maxWidth: '58ch',
          lineHeight: '1.55',
          marginBottom: 'clamp(24px, 3vw, 34px)',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '240ms',
        })}
      >
        {project.problem ?? project.description}{' '}
        {href ? (
          <a
            href={href}
            className={css({
              fontFamily: 'display',
              fontSize: '0.9em',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              minHeight: '44px',
              lineHeight: '44px',
              color: 'text',
              textDecoration: 'underline',
              textDecorationColor: 'accent',
              textUnderlineOffset: '0.18em',
            })}
          >
            {hostOf(href)} ↗
          </a>
        ) : null}
      </p>
      <ClientLedger project={project} />
    </>
  )
}
