import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FeaturedBlock } from './FeaturedBlock'

type Project = (typeof projects)[number]

const titleBase = {
  fontFamily: 'display',
  fontWeight: 'bold',
  lineHeight: '0.95',
  letterSpacing: '-0.03em',
  color: 'text',
  wordBreak: 'keep-all',
} as const

const titleRow = css({
  ...titleBase,
  fontVariant: 'small-caps',
  fontSize: { base: 'clamp(34px, 9vw, 120px)', md: 'clamp(52px, 8vw, 120px)' },
})

const titleLead = css({
  ...titleBase,
  fontVariant: 'normal',
  textTransform: 'none',
  fontSize: { base: 'clamp(38px, 9.5vw, 134px)', md: 'clamp(58px, 9vw, 134px)' },
})

function hrefFor(p: Project): string {
  return p.depth === 'lightweight' && p.externalUrl ? p.externalUrl : `/work/${p.slug}`
}

function blurbFor(p: Project): string {
  return p.description ?? p.problem ?? ''
}

export function WorkRow({ project, lead }: { project: Project; lead: boolean }) {
  const href = hrefFor(project)
  const external = href.startsWith('http')
  const blurb = blurbFor(project)
  return (
    <div
      className={css({
        display: 'block',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        _first: { borderTopWidth: '0' },
        paddingBlock: 'clamp(14px, 2.2vw, 22px)',
        minHeight: 'clamp(96px, 11vh, 140px)',
        transition: 'background 0.18s ease',
        _hover: { bg: 'surface' },
        '&:hover [data-row-title]': {
          textDecoration: 'underline',
          textDecorationColor: 'accent',
          textUnderlineOffset: '0.08em',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        })}
      >
        <a
          href={href}
          data-row-title=""
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={lead ? titleLead : titleRow}
        >
          {project.title}
        </a>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'clamp(15px, 1.6vw, 20px)',
            color: 'textMuted',
            flex: 'none',
          })}
        >
          {project.year}
        </span>
      </div>
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginTop: '8px',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'accentText',
            bg: 'accent',
            borderRadius: 'sm',
            paddingBlock: '4px',
            paddingInline: '9px',
            lineHeight: '1.4',
            flex: 'none',
          })}
        >
          {project.type}
        </span>
        {blurb ? (
          <span
            className={css({
              fontFamily: 'body',
              fontWeight: 'normal',
              fontSize: 'clamp(15px, 1.5vw, 19px)',
              color: 'textMuted',
              lineHeight: '1.4',
              maxWidth: '62ch',
            })}
          >
            {blurb}
          </span>
        ) : null}
      </div>
      {project.featured && project.problem ? (
        <FeaturedBlock problem={project.problem} url={project.externalUrl ?? project.liveUrl} />
      ) : null}
    </div>
  )
}
