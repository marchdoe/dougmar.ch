import { css } from '../../../styled-system/css'

type CaseProject = {
  type: string
  year: number
  role?: string
  timeline?: string
  status?: string
  problem?: string
  approach?: string
  outcome?: string
  stack?: string[]
  liveUrl?: string
}

export function CaseStudyBody({ project }: { project: CaseProject }) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={metaRowClass}>
        <Meta k="type" v={project.type} />
        <Meta k="year" v={String(project.year)} />
        {project.role && <Meta k="role" v={project.role} />}
        {project.timeline && <Meta k="timeline" v={project.timeline.replace(/\s*—\s*/g, ', ')} />}
        {project.status && <Meta k="status" v={project.status} />}
      </div>
      {project.problem && <Block label="problem" text={project.problem} />}
      {project.approach && <Block label="approach" text={project.approach} />}
      {project.outcome && <Block label="outcome" text={project.outcome} />}
      {project.stack && project.stack.length > 0 && (
        <div className={blockWrapClass}>
          <div className={labelClass}>stack</div>
          <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2', marginTop: '3' })}>
            {project.stack.map((s) => (
              <span key={s} className={tagClass}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {project.liveUrl && (
        <div className={blockWrapClass}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener"
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              paddingTop: '2',
              paddingBottom: '2',
              fontFamily: 'display',
              fontSize: 'sm',
              color: 'accent',
              textDecoration: 'underline',
            })}
          >
            visit live site
          </a>
        </div>
      )}
    </section>
  )
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        {k}
      </div>
      <div
        className={css({
          fontFamily: 'display',
          fontSize: 'sm',
          color: 'text',
          textTransform: 'lowercase',
        })}
      >
        {v}
      </div>
    </div>
  )
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div className={blockWrapClass}>
      <div className={labelClass}>{label}</div>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'base',
          color: 'textMuted',
          maxWidth: '62ch',
          marginTop: '4',
        })}
      >
        {text}
      </p>
    </div>
  )
}

const metaRowClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8',
  paddingTop: { base: '6', md: '8' },
  paddingBottom: { base: '6', md: '8' },
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
  borderBottom: '1px solid',
  borderColor: 'borderStrong',
})

const blockWrapClass = css({
  paddingTop: { base: '6', md: '8' },
  paddingBottom: { base: '6', md: '8' },
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
  borderBottom: '1px solid',
  borderColor: 'border',
})

const labelClass = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accent',
})

const tagClass = css({
  fontFamily: 'display',
  fontSize: 'xs',
  color: 'text',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'sm',
  paddingTop: '2',
  paddingBottom: '2',
  paddingLeft: '3',
  paddingRight: '3',
  textTransform: 'lowercase',
})
