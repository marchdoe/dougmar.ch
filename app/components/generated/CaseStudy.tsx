import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

// Mockup accentDeep (#223f10) has no token; nearest semantic ink on bg is `accent`.
function CaseBlock({ label, text }: { label: string; text: string }) {
  return (
    <div
      className={css({
        marginTop: '32px',
        marginBottom: '16px',
        paddingBlock: '16px',
        paddingInline: '18px',
        bg: 'bg',
        borderLeftWidth: '3px',
        borderLeftStyle: 'solid',
        borderLeftColor: 'accent',
        maxWidth: '72ch',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          textStyle: 'sm',
          color: 'accent',
          marginBottom: '6px',
        })}
      >
        {label}
      </h2>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'base',
          lineHeight: '1.55',
          color: 'text',
          maxWidth: '48ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const blocks = [
    { label: 'Problem', text: project.problem ?? '' },
    { label: 'Approach', text: project.approach ?? '' },
    { label: 'Outcome', text: project.outcome ?? '' },
  ].filter((b) => b.text !== '')
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingInline: 'clamp(20px, 5vw, 72px)',
        paddingBottom: 'clamp(32px, 6vw, 72px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {project.description ? (
        <p
          className={css({
            paddingTop: '24px',
            fontFamily: 'body',
            fontSize: 'lede',
            color: 'textMuted',
            maxWidth: '48ch',
          })}
        >
          {project.description}
        </p>
      ) : null}
      {blocks.map((b) => (
        <CaseBlock key={b.label} label={b.label} text={b.text} />
      ))}
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          listStyle: 'none',
          padding: '0',
          marginTop: '32px',
          maxWidth: 'none',
        })}
      >
        {stack.map((s) => (
          <li
            key={s}
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              textStyle: 'sm',
              color: 'accentText',
              bg: 'accent',
              borderRadius: 'sm',
              paddingBlock: '4px',
              paddingInline: '10px',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '16px',
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'sm',
            color: 'text',
            textDecoration: 'underline',
            textDecorationColor: 'accent',
            textDecorationThickness: '2px',
            textUnderlineOffset: '0.2em',
            _hover: { textDecorationColor: 'text' },
          })}
        >
          Visit the live project ↗
        </a>
      ) : null}
    </section>
  )
}
