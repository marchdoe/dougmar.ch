import { Box } from '../../../styled-system/jsx'

export function IdentityStatement({ statement, role }: { statement: string; role: string }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '40px', md: '64px' }}
      display="flex"
      flexDirection="column"
      gap="16px"
    >
      <Box
        as="span"
        textStyle="sm"
        textTransform="uppercase"
        letterSpacing="wide"
        color="accentAlt"
        fontWeight="700"
      >
        {role}
      </Box>
      <Box
        as="p"
        fontFamily="display"
        fontWeight="400"
        textStyle="lg"
        lineHeight="snug"
        color="text"
        maxW="34ch"
      >
        {statement}
      </Box>
    </Box>
  )
}
