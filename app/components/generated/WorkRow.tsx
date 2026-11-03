import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const titleClass = {
  lead: css({
    fontFamily: 'display',
    fontSize: {
      base: 'clamp(34px,10vw,52px)',
      md: 'clamp(44px,8vw,68px)',
      lg: 'clamp(44px,5.4vw,74px)',
    },
    lineHeight: '0.94',
    fontWeight: 'normal',
    letterSpacing: '0.02em',
    textTransform: 'lowercase',
    fontVariant: 'small-caps',
  }),
  small: css({
    fontFamily: 'display',
    fontSize: {
      base: 'clamp(34px,10vw,52px)',
      md: 'clamp(44px,8vw,68px)',
      lg: 'clamp(32px,3.6vw,50px)',
    },
    lineHeight: '0.94',
    fontWeight: 'normal',
    letterSpacing: '0.02em',
    textTransform: 'lowercase',
    fontVariant: 'small-caps',
  }),
}

const metaClass = css({
  textStyle: '2xs',
  letterSpacing: '0.11em',
  textTransform: 'uppercase',
  fontWeight: '600',
  color: 'textMuted',
})

export function WorkRow({ project, size }: { project: Project; size: keyof typeof titleClass }) {
  const lede = project.description ?? project.problem
  const meta = [project.role, project.type].filter(Boolean)
  return (
    <a
      href={`/work/${project.slug}`}
      className={css({
        display: 'block',
        color: 'text',
        textAlign: 'right',
        gridColumn: { lg: '1 / 6' },
        paddingTop: { base: '22px', md: '24px', lg: '22px' },
        paddingBottom: { base: '24px', md: '28px', lg: '26px' },
        paddingInline: { base: '20px', md: '48px', lg: '0' },
        borderBottomWidth: { base: '1px', lg: '0' },
        borderTopWidth: { base: '0', lg: '1px' },
        borderStyle: 'solid',
        borderLeftWidth: '0',
        borderRightWidth: '0',
        borderColor: 'border',
        _hover: { textDecoration: 'none' },
        '&:hover h2': { color: 'accent' },
        '&:hover [data-year]': { color: 'accent' },
      })}
    >
      <h2 className={titleClass[size]}>{project.title}</h2>
      {lede && (
        <p
          className={css({
            fontSize: { base: 'clamp(16px,4.4vw,19px)', lg: '18px' },
            lineHeight: '1.3',
            color: 'textMuted',
            marginTop: '12px',
            marginLeft: 'auto',
            maxWidth: { base: '44ch', lg: '30ch' },
            textAlign: 'right',
            fontWeight: 'normal',
          })}
        >
          {lede}
        </p>
      )}
      <div
        className={css({
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          marginTop: '13px',
        })}
      >
        <span
          data-year=""
          className={css({
            textStyle: '2xs',
            letterSpacing: '0.11em',
            fontWeight: 'bold',
            color: 'accentAlt',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {project.year}
        </span>
        {meta.map((item) => (
          <span key={item} className={metaClass}>
            {item}
          </span>
        ))}
      </div>
    </a>
  )
}
