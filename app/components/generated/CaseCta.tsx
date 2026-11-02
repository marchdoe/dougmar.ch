import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'

type P = (typeof projects)[number]

const linkCss = css({
  color: 'fieldInk',
  fontWeight: 'bold',
  fontSize: 'base',
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  paddingBottom: '2px',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accentAlt',
  _hover: { color: 'fieldInkMuted' },
})

export function CaseCta({ project }: { project: P }) {
  const i = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(i + 1) % projects.length]
  const live = project.liveUrl ?? project.externalUrl
  return (
    <section
      aria-label="Next"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingBlock: 'clamp(40px, 7vh, 72px)',
        paddingInline: { base: '6vw', lg: '5vw' },
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'fieldInkMuted',
        })}
      >
        Keep Going
      </span>
      {live ? (
        <a href={live} className={linkCss}>
          Visit {project.title} live
        </a>
      ) : null}
      {next ? (
        <a href={`/work/${next.slug}`} className={linkCss}>
          Next project, {next.title}
        </a>
      ) : null}
    </section>
  )
}
