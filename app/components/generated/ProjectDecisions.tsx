import { Box } from '../../../styled-system/jsx'

type Decision = { decision: string; why: string }

export function ProjectDecisions({ decisions }: { decisions: Decision[] }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingBlock={{ base: '8', lg: '9' }}
    >
      <Box
        fontFamily="body"
        textStyle="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        color="textFaint"
        marginBottom={{ base: '6', lg: '7' }}
      >
        Decisions
      </Box>
      <Box display="flex" flexDirection="column" gap="6">
        {decisions.map((d) => (
          <Box
            key={d.decision}
            borderTop="1px solid"
            borderColor="border"
            paddingTop="5"
            maxWidth="66ch"
          >
            <Box fontFamily="body" fontWeight="600" textStyle="sm" color="text" marginBottom="1">
              {d.decision}
            </Box>
            <Box fontFamily="body" textStyle="sm" color="textMuted" lineHeight="1.5">
              {d.why}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
