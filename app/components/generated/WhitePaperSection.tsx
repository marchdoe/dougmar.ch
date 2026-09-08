import { Box } from '../../../styled-system/jsx'
import type { Project } from '../../content/projects'

type WhitePaperData = Pick<
  Project,
  'context' | 'constraints' | 'process' | 'decisions' | 'references'
>

function ContextBlock({ context, constraints }: { context?: string; constraints?: string[] }) {
  if (!context && !constraints) return null
  return (
    <Box mb="30px">
      {context ? (
        <Box as="p" textStyle="base" color="textMuted" maxW="62ch" mb={constraints ? '16px' : '0'}>
          {context}
        </Box>
      ) : null}
      {constraints ? (
        <Box as="ul" display="flex" flexWrap="wrap" gap="10px" listStyle="none" p="0">
          {constraints.map((c) => (
            <Box
              key={c}
              as="li"
              textStyle="sm"
              color="text"
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              px="12px"
              py="6px"
            >
              {c}
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  )
}

function ProcessList({
  process,
}: {
  process?: { phase: string; does: string; produces: string }[]
}) {
  if (!process) return null
  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" gap="0" mb="30px">
      {process.map((step, i) => (
        <Box
          key={step.phase}
          display="grid"
          gridTemplateColumns="minmax(24px, 32px) 1fr"
          gap="16px"
          py="14px"
          borderTop="1px solid"
          borderColor="border"
        >
          <Box textStyle="sm" color="textFaint" fontVariantNumeric="tabular-nums">
            {i + 1}
          </Box>
          <Box>
            <Box fontFamily="display" fontWeight="700" textStyle="base" color="text">
              {step.phase}
            </Box>
            <Box textStyle="sm" color="textMuted">
              {step.does}
            </Box>
            <Box textStyle="sm" color="accentAlt">
              → {step.produces}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function DecisionsList({ decisions }: { decisions?: { decision: string; why: string }[] }) {
  if (!decisions) return null
  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" gap="0" mb="30px">
      {decisions.map((d) => (
        <Box key={d.decision} py="14px" borderTop="1px solid" borderColor="border">
          <Box fontFamily="display" fontWeight="700" textStyle="base" color="text">
            {d.decision}
          </Box>
          <Box textStyle="sm" color="textMuted">
            {d.why}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

function ReferencesList({
  references,
}: {
  references?: { title: string; url: string; note?: string }[]
}) {
  if (!references) return null
  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" gap="0">
      {references.map((r) => (
        <Box key={r.url} py="14px" borderTop="1px solid" borderColor="border">
          <a href={r.url}>
            <Box as="span" fontFamily="display" fontWeight="700" textStyle="base" color="accent">
              {r.title}
            </Box>
          </a>
          {r.note ? (
            <Box textStyle="sm" color="textMuted">
              {r.note}
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  )
}

export function WhitePaperSection({ paper }: { paper: WhitePaperData }) {
  const hasAny =
    paper.context || paper.constraints || paper.process || paper.decisions || paper.references
  if (!hasAny) return null
  return (
    <Box
      as="section"
      bg="bg"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
    >
      <ContextBlock context={paper.context} constraints={paper.constraints} />
      <ProcessList process={paper.process} />
      <DecisionsList decisions={paper.decisions} />
      <ReferencesList references={paper.references} />
    </Box>
  )
}
