import { css } from '../../../styled-system/css'

const label = css({
  fontWeight: 'bold',
  fontSize: 'sm',
  letterSpacing: 'wide',
  fontVariant: 'small-caps',
  textTransform: 'lowercase',
  color: 'accentAlt',
  marginBottom: '2',
})

const body = css({
  fontSize: 'md',
  color: 'text',
  lineHeight: 'normal',
  maxWidth: '66ch',
  marginBottom: '7',
})

export function CaseStudyNarrative({
  problem,
  approach,
  outcome,
}: {
  problem?: string
  approach?: string
  outcome?: string
}) {
  return (
    <section
      className={css({
        bg: 'surface',
        padding: { base: '9 5 10', lg: '64px 56px' },
        borderTop: '1px solid',
        borderColor: 'borderStrong',
      })}
    >
      {problem && (
        <div>
          <p className={label}>Problem</p>
          <p className={body}>{problem}</p>
        </div>
      )}
      {approach && (
        <div>
          <p className={label}>Approach</p>
          <p className={body}>{approach}</p>
        </div>
      )}
      {outcome && (
        <div>
          <p className={label}>Outcome</p>
          <p className={body}>{outcome}</p>
        </div>
      )}
    </section>
  )
}
