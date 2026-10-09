import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Kind = 'selected' | 'experiment'

const titleCls: Record<Kind, string> = {
  selected: css({ fontSize: { base: '44px', lg: 'clamp(64px, 6.5vw, 94px)' } }),
  experiment: css({ fontSize: { base: '2xl', lg: '4xl' } }),
}

const yearCls: Record<Kind, string> = {
  selected: css({ fontSize: { base: 'xl', lg: '3xl' } }),
  experiment: css({ fontSize: { base: 'lg', lg: '2xl' } }),
}

const rowBase = css({
  display: 'block',
  position: 'relative',
  paddingBlock: '20px',
  paddingInline: '6px',
  borderTop: '1px solid',
  borderColor: 'border',
  color: 'text',
  _hover: { bg: 'surface', color: 'text' },
  lg: { paddingBlock: '26px', paddingInline: '0' },
})

export function WorkRow({
  project,
  href,
  kind,
  placement,
}: {
  project: Project
  href: string
  kind: Kind
  placement: string
}) {
  return (
    <a href={href} className={cx('group', rowBase, placement)}>
      <span
        className={css({ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' })}
      >
        <span
          className={cx(
            css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              lineHeight: 'tight',
              color: 'text',
            }),
            titleCls[kind]
          )}
        >
          {project.title}
        </span>
        <span
          className={cx(
            css({
              fontFamily: 'display',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 'tight',
              color: 'textFaint',
              marginLeft: 'auto',
              transition: 'color 160ms ease',
              _groupHover: { color: 'accentAlt' },
            }),
            yearCls[kind]
          )}
        >
          {project.year}
        </span>
      </span>
      <span
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '1',
          columnGap: '20px',
          alignItems: 'baseline',
          marginTop: '12px',
          fontSize: 'sm',
          color: 'textMuted',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
        })}
      >
        <span className={css({ color: 'textFaint' })}>{project.type}</span>
        <span className={css({ color: 'accentAlt', letterSpacing: 'wider' })}>View ↗</span>
      </span>
    </a>
  )
}
