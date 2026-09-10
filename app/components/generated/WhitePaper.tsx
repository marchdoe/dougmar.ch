import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Process = { phase: string; does: string; produces: string }
type Decision = { decision: string; why: string }
type Reference = { title: string; url: string; note?: string }

const label = css({
  textStyle: '2xs',
  fontWeight: '700',
  fontVariant: 'small-caps',
  letterSpacing: 'widest',
  color: 'textMuted',
  marginBottom: '4',
})

function ContextSection({ context }: { context?: string }) {
  if (!context) return null
  return (
    <Box>
      <p className={label}>Context</p>
      <p
        className={css({
          textStyle: 'base',
          lineHeight: 'normal',
          color: 'text',
          maxWidth: '64ch',
        })}
      >
        {context}
      </p>
    </Box>
  )
}

function ConstraintsSection({ constraints }: { constraints?: string[] }) {
  if (!constraints || constraints.length === 0) return null
  return (
    <Box>
      <p className={label}>Constraints</p>
      <Box
        as="ul"
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        })}
      >
        {constraints.map((c) => (
          <Box
            as="li"
            key={c}
            className={css({
              border: '1px solid',
              borderColor: 'border',
              paddingX: '4',
              paddingY: '2',
              textStyle: 'sm',
              color: 'text',
            })}
          >
            {c}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function ProcessSection({ process }: { process?: Process[] }) {
  if (!process || process.length === 0) return null
  return (
    <Box>
      <p className={label}>Process</p>
      <Box className={css({ borderTop: '1px solid', borderColor: 'borderStrong' })}>
        {process.map((p, i) => (
          <Box
            key={p.phase}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '160px 1fr 1fr' },
              columnGap: '5',
              rowGap: '2',
              paddingY: '4',
              borderBottom: '1px solid',
              borderColor: 'border',
            })}
          >
            <span className={css({ textStyle: 'sm', fontWeight: '700', color: 'text' })}>
              {i + 1}. {p.phase}
            </span>
            <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{p.does}</span>
            <span className={css({ textStyle: 'sm', color: 'textMuted', fontStyle: 'italic' })}>
              → {p.produces}
            </span>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function DecisionsSection({ decisions }: { decisions?: Decision[] }) {
  if (!decisions || decisions.length === 0) return null
  return (
    <Box>
      <p className={label}>Decisions</p>
      <Box className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}>
        {decisions.map((d) => (
          <Box
            key={d.decision}
            className={css({ borderLeft: '2px solid', borderColor: 'border', paddingLeft: '4' })}
          >
            <p className={css({ textStyle: 'base', fontWeight: '600', color: 'text' })}>
              {d.decision}
            </p>
            <p className={css({ textStyle: 'sm', color: 'textMuted', marginTop: '1' })}>{d.why}</p>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function ReferencesSection({ references }: { references?: Reference[] }) {
  if (!references || references.length === 0) return null
  return (
    <Box>
      <p className={label}>References</p>
      <Box className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
        {references.map((r) => (
          <a
            key={r.url}
            href={r.url}
            className={css({
              display: 'block',
              textStyle: 'sm',
              color: 'text',
              borderBottom: '1px solid',
              borderColor: 'border',
              paddingBottom: '2',
              _hover: { color: 'border' },
            })}
          >
            {r.title}
            {r.note ? ` — ${r.note}` : ''}
          </a>
        ))}
      </Box>
    </Box>
  )
}

export function WhitePaper(props: {
  context?: string
  constraints?: string[]
  process?: Process[]
  decisions?: Decision[]
  references?: Reference[]
}) {
  return (
    <Box className={css({ marginTop: '9', display: 'flex', flexDirection: 'column', gap: '9' })}>
      <ContextSection context={props.context} />
      <ConstraintsSection constraints={props.constraints} />
      <ProcessSection process={props.process} />
      <DecisionsSection decisions={props.decisions} />
      <ReferencesSection references={props.references} />
    </Box>
  )
}
