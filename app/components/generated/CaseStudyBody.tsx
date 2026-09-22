import { css } from '../../../styled-system/css'

type CaseStudy = {
  problem?: string
  approach?: string
  outcome?: string
  stack?: string[]
  liveUrl?: string
}

function Block({ label, text }: { label: string; text?: string }) {
  if (!text) return null
  return (
    <div className={css({ borderTop: '1px solid', borderColor: 'border', paddingBlock: '6' })}>
      <span
        className={css({
          display: 'block',
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'accentAlt',
          marginBottom: '3',
        })}
      >
        {label}
      </span>
      <p
        className={css({
          color: 'textMuted',
          fontSize: 'base',
          maxWidth: '52ch',
          lineHeight: 'loose',
        })}
      >
        {text}
      </p>
    </div>
  )
}

export function CaseStudyBody({ study }: { study: CaseStudy }) {
  return (
    <section
      className={css({
        bg: 'surface',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'md',
        marginInline: '6vw',
        paddingInline: '6',
        paddingBlock: '2',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Block label="Problem" text={study.problem} />
      <Block label="Approach" text={study.approach} />
      <Block label="Outcome" text={study.outcome} />
      {study.stack && study.stack.length > 0 && (
        <div
          className={css({
            borderTop: '1px solid',
            borderColor: 'border',
            paddingBlock: '6',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
          })}
        >
          {study.stack.map((tech) => (
            <span
              key={tech}
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'text',
                bg: 'bgAlt',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'sm',
                paddingInline: '3',
                paddingBlock: '2',
              })}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      {study.liveUrl && (
        <div className={css({ borderTop: '1px solid', borderColor: 'border', paddingBlock: '6' })}>
          <a
            href={study.liveUrl}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              minHeight: '44px',
              color: 'accentAlt',
              fontWeight: 'bold',
              fontSize: 'sm',
            })}
          >
            Visit the live site →
          </a>
        </div>
      )}
    </section>
  )
}
