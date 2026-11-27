import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const label = css({
  display: 'block',
  textStyle: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
  marginBottom: '2',
})

function CaseBody({ project }: { project: Project }) {
  const rows = [
    { k: 'Problem', v: project.problem ?? '' },
    { k: 'Approach', v: project.approach ?? '' },
    { k: 'Outcome', v: project.outcome ?? '' },
  ].filter((r) => r.v)
  const blocks =
    rows.length > 0 ? rows : [{ k: 'Summary', v: project.description ?? '' }].filter((r) => r.v)
  return (
    <section
      className={css({
        bg: 'surface',
        paddingBlock: { base: '40px', lg: '64px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
        rowGap: '6',
        columnGap: '6vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {blocks.map((b) => (
        <div
          key={b.k}
          className={css({
            paddingTop: '4',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
          })}
        >
          <span className={label}>{b.k}</span>
          <p
            className={css({
              textStyle: 'base',
              lineHeight: '1.6',
              color: 'text',
              maxWidth: '46ch',
            })}
          >
            {b.v}
          </p>
        </div>
      ))}
    </section>
  )
}

function CaseStack({ project }: { project: Project }) {
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingBlock: { base: '34px', lg: '48px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: 'flex',
        flexDirection: { base: 'column', lg: 'row' },
        justifyContent: 'space-between',
        alignItems: { base: 'flex-start', lg: 'center' },
        gap: '5',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {stack.length > 0 ? (
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
          })}
        >
          {stack.map((s) => (
            <li
              key={s}
              className={css({
                textStyle: 'sm',
                textTransform: 'lowercase',
                color: 'text',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'borderStrong',
                borderRadius: 'sm',
                paddingBlock: '1',
                paddingInline: '3',
              })}
            >
              {s}
            </li>
          ))}
        </ul>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5' })}>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              color: 'accent',
              textStyle: 'sm',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '5px',
              _hover: { color: 'accentAlt' },
            })}
          >
            Visit the live site ↗
          </a>
        ) : null}
        <a
          href="/work"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            color: 'text',
            textStyle: 'sm',
            textDecoration: 'underline',
            textUnderlineOffset: '5px',
          })}
        >
          back to the work
        </a>
      </div>
    </section>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <CaseBody project={project} />
      <CaseStack project={project} />
    </>
  )
}
