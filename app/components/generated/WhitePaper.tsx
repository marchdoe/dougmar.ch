import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Process = { phase: string; does: string; produces: string }
type Decision = { decision: string; why: string }
type Reference = { title: string; url: string; note?: string }
type Project = {
  context?: string
  constraints?: string[]
  process?: Process[]
  decisions?: Decision[]
  references?: Reference[]
}

const labelStyle = css({
  fontSize: 'xs',
  fontWeight: '600',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textFaint',
})

export function WhitePaper({ project }: { project: Project }) {
  return (
    <Box
      as="section"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '32px 56px', md: '48px 72px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '8',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {project.context && (
        <ContextBlock context={project.context} constraints={project.constraints} />
      )}
      {project.process && <ProcessBlock process={project.process} />}
      {project.decisions && <DecisionsBlock decisions={project.decisions} />}
      {project.references && <ReferencesBlock references={project.references} />}
    </Box>
  )
}

function ContextBlock({ context, constraints }: { context: string; constraints?: string[] }) {
  return (
    <Box>
      <span className={labelStyle}>Context</span>
      <Box
        as="p"
        color="textMuted"
        className={css({ fontSize: 'md', maxWidth: '66ch', marginTop: '2' })}
      >
        {context}
      </Box>
      {constraints && (
        <Box
          as="ul"
          className={css({
            marginTop: '3',
            paddingLeft: '5',
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
          })}
        >
          {constraints.map((c) => (
            <li key={c} className={css({ fontSize: 'base', color: 'textMuted' })}>
              {c}
            </li>
          ))}
        </Box>
      )}
    </Box>
  )
}

function ProcessBlock({ process }: { process: Process[] }) {
  return (
    <Box>
      <span className={labelStyle}>Process</span>
      <Box className={css({ display: 'flex', flexDirection: 'column', marginTop: '3' })}>
        {process.map((step, i) => (
          <Box
            key={step.phase}
            className={css({
              display: 'flex',
              gap: '4',
              borderTop: '1px solid',
              borderColor: 'border',
              paddingBlock: '3',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                color: 'accent',
                fontSize: 'sm',
                minWidth: '28px',
              })}
            >
              {i + 1}
            </span>
            <Box>
              <Box fontFamily="display" color="text" className={css({ fontSize: 'md' })}>
                {step.phase}
              </Box>
              <Box as="p" color="textMuted" className={css({ fontSize: 'sm', marginTop: '1' })}>
                {step.does}
              </Box>
              <Box
                as="p"
                color="textFaint"
                fontStyle="italic"
                className={css({ fontSize: 'sm', marginTop: '1' })}
              >
                {step.produces}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function DecisionsBlock({ decisions }: { decisions: Decision[] }) {
  return (
    <Box>
      <span className={labelStyle}>Decisions</span>
      <Box className={css({ display: 'flex', flexDirection: 'column', marginTop: '3', gap: '4' })}>
        {decisions.map((d) => (
          <Box
            key={d.decision}
            className={css({ borderTop: '1px solid', borderColor: 'border', paddingTop: '3' })}
          >
            <Box fontFamily="display" color="text" className={css({ fontSize: 'md' })}>
              {d.decision}
            </Box>
            <Box as="p" color="textMuted" className={css({ fontSize: 'sm', marginTop: '1' })}>
              {d.why}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function ReferencesBlock({ references }: { references: Reference[] }) {
  return (
    <Box>
      <span className={labelStyle}>References</span>
      <Box className={css({ display: 'flex', flexDirection: 'column', marginTop: '3', gap: '2' })}>
        {references.map((r) => (
          <a
            key={r.url}
            href={r.url}
            className={css({
              fontSize: 'sm',
              color: 'accent',
              textDecoration: 'underline',
              textUnderlineOffset: '0.16em',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              paddingBlock: '2',
            })}
          >
            {r.title}
            {r.note ? `, ${r.note}` : ''}
          </a>
        ))}
      </Box>
    </Box>
  )
}
