import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function longestWord(title: string) {
  return title.split(/\s+/).reduce((max, word) => Math.max(max, word.length), 4)
}

export function FeaturedCard({ project }: { project: Project }) {
  const href = project.externalUrl ?? project.liveUrl ?? `/work/${project.slug}`
  return (
    <div
      style={{ '--len': longestWord(project.title) } as CSSProperties}
      className={css({
        containerType: 'inline-size',
        marginTop: '18px',
        marginBottom: '2',
        padding: '3',
        bg: 'surface',
        borderRadius: 'lg',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          marginBottom: '2',
        })}
      >
        Featured · {project.type}
      </div>
      {/* capped under the index titles so the work index keeps the page's largest type, as in the mockup */}
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: {
            base: 'min(clamp(26px, 7.2vw, 40px), calc(100cqi / (var(--len) * 0.66)))',
            lg: 'min(60px, calc(100cqi / (var(--len) * 0.66)))',
          },
          lineHeight: { base: '1', lg: '0.98' },
          letterSpacing: '-0.01em',
          color: 'text',
        })}
      >
        {project.title}
      </div>
      {project.problem ? (
        <p
          className={css({
            color: 'textMuted',
            fontSize: 'sm',
            maxWidth: '48ch',
            marginTop: '2',
            marginBottom: '2',
          })}
        >
          {project.problem}
        </p>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontFamily: 'display',
          fontSize: 'sm',
          letterSpacing: 'wide',
          color: 'text',
          textDecoration: 'underline',
          textDecorationColor: 'accent',
          textDecorationThickness: '2px',
          textUnderlineOffset: '4px',
          _hover: { color: 'accent' },
        })}
      >
        {project.title} ↗
      </a>
    </div>
  )
}
