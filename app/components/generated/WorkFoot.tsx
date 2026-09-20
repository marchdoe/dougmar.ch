import { css } from '../../../styled-system/css'

type NavProject = { slug: string; title: string }

export function WorkFoot({ prev, next }: { prev?: NavProject; next?: NavProject }) {
  return (
    <footer
      className={css({
        position: 'relative',
        bg: 'bgAlt',
        borderTop: '3px solid',
        borderColor: 'borderStrong',
        paddingTop: { base: '6', md: '8' },
        paddingBottom: { base: '10', md: '12' },
        paddingLeft: { base: '5', md: '6vw' },
        paddingRight: { base: '5', md: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          marginBottom: '5',
        })}
      >
        more from the register
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
        {prev && <FootLink num="01" label="previous" project={prev} />}
        {next && <FootLink num="02" label="next" project={next} />}
      </div>
    </footer>
  )
}

function FootLink({ num, label, project }: { num: string; label: string; project: NavProject }) {
  return (
    <a
      href={`/work/${project.slug}`}
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '3',
        alignItems: 'baseline',
        paddingTop: '3',
        paddingBottom: '3',
        borderBottom: '1px solid',
        borderColor: 'border',
        color: 'text',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          color: 'accent',
          fontWeight: 'bold',
          fontSize: 'sm',
        })}
      >
        {num}
      </span>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        {label}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontSize: 'lg',
          textTransform: 'lowercase',
          color: 'text',
          minWidth: 0,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          flexBasis: { base: '100%', md: 'auto' },
        })}
      >
        {project.title}
      </span>
    </a>
  )
}
