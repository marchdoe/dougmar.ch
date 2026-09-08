import { Box } from '../../../styled-system/jsx'
import { HeroPhrase } from './HeroPhrase'
import { ExhaustedField } from './ExhaustedField'
import { RebuildField } from './RebuildField'

export function Stage() {
  return (
    <Box
      position="relative"
      minH="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg="bg"
    >
      <HeroPhrase />
      <Box
        position="relative"
        zIndex="2"
        flex="1"
        display="flex"
        flexDirection="column"
        // collapse: split-to-sequence at base, side-by-side from lg (900px)
        css={{ lg: { display: 'grid', gridTemplateColumns: '1fr 1fr' } }}
      >
        <ExhaustedField />
        <RebuildField />
      </Box>
    </Box>
  )
}
