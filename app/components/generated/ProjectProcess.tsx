import { Box } from '../../../styled-system/jsx'

type Step = { phase: string; does: string; produces: string }

export function ProjectProcess({ process }: { process: Step[] }) {
  return (
    <Box
      as="section"
      bg="bg"
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
        Process
      </Box>
      <Box
        as="ol"
        margin="0"
        padding="0"
        listStyleType="none"
        display="flex"
        flexDirection="column"
        gap="6"
      >
        {process.map((step, i) => (
          <Box
            as="li"
            key={step.phase}
            display="flex"
            gap="5"
            borderTop="1px solid"
            borderColor="border"
            paddingTop="5"
          >
            <Box
              flex="0 0 40px"
              fontFamily="body"
              textStyle="sm"
              color="textFaint"
              fontVariantNumeric="tabular-nums"
            >
              {String(i + 1).padStart(2, '0')}
            </Box>
            <Box flex="1 1 auto" maxWidth="60ch">
              <Box fontFamily="body" fontWeight="600" textStyle="sm" color="text" marginBottom="1">
                {step.phase}
              </Box>
              <Box fontFamily="body" textStyle="sm" color="textMuted" lineHeight="1.5">
                {step.does}
              </Box>
              <Box fontFamily="body" textStyle="xs" color="textFaint" marginTop="1">
                → {step.produces}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
