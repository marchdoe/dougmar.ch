import { Box, Flex } from '../../../styled-system/jsx'

export function RebuildField() {
  return (
    <Box
      bg="field"
      borderTop={{ base: '1px solid', md: 'none' }}
      borderColor="fieldBorder"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      display="flex"
      flexDirection="column"
      gap={{ base: '18px', md: '28px' }}
      color="fieldInk"
    >
      <Box display="flex" alignItems="baseline" gap="14px" flexWrap="wrap">
        <Box
          as="span"
          textStyle="sm"
          textTransform="uppercase"
          letterSpacing="wide"
          color="accentAlt"
          fontWeight="700"
        >
          Tonight&rsquo;s Rebuild Log
        </Box>
        <Box
          as="span"
          textStyle="2xs"
          textTransform="uppercase"
          letterSpacing="wide"
          color="fieldInkMuted"
          fontWeight="600"
        >
          03:00 EDT · commit
        </Box>
      </Box>

      <Box textStyle="lg" lineHeight="loose" color="fieldInkMuted" maxW="34ch">
        While the internet slept, this page{' '}
        <Box as="b" color="fieldInk" fontWeight="600">
          tore itself down and built itself back.
        </Box>{' '}
        Against a tired web, the one honest flex is a fact — here is the log.
      </Box>

      <Flex
        align="center"
        gap={{ base: '16px', md: '28px' }}
        bg="surface"
        border="1px solid"
        borderColor="fieldBorder"
        borderRadius="md"
        px={{ base: '18px', md: '28px' }}
        py={{ base: '18px', md: '26px' }}
      >
        <Box
          fontFamily="display"
          fontWeight="900"
          fontSize={{ base: '38px', md: '62px' }}
          lineHeight="0.9"
          color="accent"
        >
          5&ndash;4
        </Box>
        <Box display="flex" flexDirection="column" gap="5px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            Detroit · W
          </Box>
          <Box
            textStyle="2xs"
            textTransform="uppercase"
            letterSpacing="wide"
            color="fieldInkMuted"
            fontWeight="500"
          >
            The day&rsquo;s single bright fact
          </Box>
        </Box>
      </Flex>

      <Flex gap={{ base: '16px', md: '40px' }} flexWrap="wrap" mt="4px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            63.9°F
          </Box>
          <Box
            textStyle="2xs"
            textTransform="uppercase"
            letterSpacing="wide"
            color="fieldInkMuted"
            fontWeight="500"
          >
            Clear · Aldie VA
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            8%
          </Box>
          <Box
            textStyle="2xs"
            textTransform="uppercase"
            letterSpacing="wide"
            color="fieldInkMuted"
            fontWeight="500"
          >
            Waning crescent · near-new
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Box fontFamily="display" fontWeight="700" textStyle="lg" color="fieldInk">
            v.0908
          </Box>
          <Box
            textStyle="2xs"
            textTransform="uppercase"
            letterSpacing="wide"
            color="fieldInkMuted"
            fontWeight="500"
          >
            Rebuilt nightly · from scratch
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
