import { Box, Wrap } from '../../../styled-system/jsx'

export function CapabilitiesPanel({ capabilities }: { capabilities: string[] }) {
  return (
    <Box
      as="section"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      bg="bgAlt"
    >
      <Box
        as="h2"
        fontFamily="display"
        fontWeight="700"
        textStyle="2xl"
        mb={{ base: '18px', md: '26px' }}
      >
        Capabilities
      </Box>
      <Wrap gap="12px" bg="surface" borderRadius="md" p={{ base: '20px', md: '28px' }}>
        {capabilities.map((c) => (
          <Box
            key={c}
            as="span"
            textStyle="sm"
            textTransform="uppercase"
            letterSpacing="wide"
            fontWeight="600"
            color="textMuted"
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            px="14px"
            py="8px"
          >
            {c}
          </Box>
        ))}
      </Wrap>
    </Box>
  )
}
