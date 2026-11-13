import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { label } from './styles'

type Project = (typeof projects)[number]

const ptLink = css({
  color: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  _hover: { textDecoration: 'none' },
})

// Labels on the field use fieldInk: fieldInkMuted measured 4.00:1 on field.
export function FeatureTile({ project }: { project: Project }) {
  const external = project.externalUrl ?? `/work/${project.slug}`
  return (
    <div
      className={css({
        gridColumn: { base: 'auto', md: 'span 2' },
        bg: 'field',
        color: 'fieldInk',
        minHeight: '240px',
        minWidth: '0',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '18px',
      })}
    >
      <div>
        <div className={cx(label, css({ color: 'fieldInk' }))}>
          Featured · {project.type} · {project.year}
        </div>
        <h3
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: 'clamp(30px, 5vw, 52px)',
            lineHeight: '0.95',
            color: 'fieldInk',
            marginTop: '2',
          })}
        >
          <a href={`/work/${project.slug}`} className={ptLink}>
            {project.title}
          </a>
        </h3>
      </div>
      {project.problem ? (
        <p
          className={css({
            fontSize: '15px',
            lineHeight: '1.5',
            color: 'fieldInk',
            maxWidth: '48ch',
            margin: '0',
          })}
        >
          {project.problem}
        </p>
      ) : null}
      <a
        href={external}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          minHeight: '44px',
          fontFamily: 'body',
          fontSize: '15px',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'fieldInk',
          _hover: { textDecoration: 'underline' },
        })}
      >
        Read the case ↗
      </a>
    </div>
  )
}

export function ProjTile({ project, href }: { project: Project; href: string }) {
  return (
    <a
      href={href}
      className={cx(
        'group',
        css({
          bg: 'bgAlt',
          minHeight: '150px',
          minWidth: '0',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '4',
          _hover: { textDecoration: 'none' },
        })
      )}
    >
      <span className={cx(label, css({ color: 'textMuted' }))}>
        {project.type} · {project.year}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: 'clamp(24px, 3.4vw, 34px)', md: '22px', lg: '28px', xl: '34px' },
          lineHeight: '0.95',
          color: 'text',
          _groupHover: { color: 'accent' },
        })}
      >
        {project.title}
      </span>
    </a>
  )
}
