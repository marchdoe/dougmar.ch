import { Box, Flex } from '../../../styled-system/jsx'
import type { personal as PersonalType } from '../../content/about'

type Personal = typeof PersonalType

export function PersonalStamps({ personal }: { personal: Personal }) {
  return (
    <Box
      as="section"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      bg="field"
      color="fieldInk"
      borderTop="1px solid"
      borderColor="fieldBorder"
    >
      <Box
        as="h2"
        fontFamily="display"
        fontWeight="700"
        textStyle="2xl"
        mb={{ base: '18px', md: '26px' }}
      >
        Off the clock
      </Box>
      <Flex gap={{ base: '16px', md: '40px' }} flexWrap="wrap">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            {personal.holesInOne}
          </Box>
          <Box textStyle="2xs" textTransform="uppercase" letterSpacing="wide" color="fieldInkMuted">
            Holes in one · {personal.sport}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            {personal.teams.join(' · ')}
          </Box>
          <Box textStyle="2xs" textTransform="uppercase" letterSpacing="wide" color="fieldInkMuted">
            Teams
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            {personal.currentFocus}
          </Box>
          <Box textStyle="2xs" textTransform="uppercase" letterSpacing="wide" color="fieldInkMuted">
            Current focus
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
