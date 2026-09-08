import { Box } from '../../../styled-system/jsx'
import { EvidenceRow } from './EvidenceRow'

export function ExhaustedField() {
  return (
    <Box
      bg="bgAlt"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      display="flex"
      flexDirection="column"
      gap={{ base: '18px', md: '28px' }}
      borderRight={{ lg: '1px solid' }}
      borderColor={{ lg: 'fieldBorder' }}
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
          The Tired Internet
        </Box>
        <Box
          as="span"
          textStyle="2xs"
          textTransform="uppercase"
          letterSpacing="wide"
          color="textFaint"
          fontWeight="600"
        >
          Sept 8, 2026 · evidence
        </Box>
      </Box>

      <Box fontFamily="display" fontWeight="400" textStyle="2xl" color="text" maxW="22ch">
        Life is one long process of getting tired.
        <Box
          as="cite"
          display="block"
          mt="14px"
          fontFamily="body"
          fontStyle="normal"
          textStyle="sm"
          letterSpacing="wide"
          textTransform="uppercase"
          color="textFaint"
          fontWeight="600"
        >
          Samuel Butler
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="stretch" gap="0">
        <EvidenceRow k="Burnout">
          Three sidebar essays in a row on{' '}
          <Box as="b" color="text" fontWeight="600">
            lost agency and exhaustion
          </Box>{' '}
          — the loudest convergence of the day.
        </EvidenceRow>
        <EvidenceRow k="Security">
          Hacker News, top of the feed:{' '}
          <Box as="b" color="text" fontWeight="600">
            &ldquo;we have a year to fix security everywhere.&rdquo;
          </Box>
        </EvidenceRow>
        <EvidenceRow k="Market">
          <Box
            as="span"
            fontFamily="display"
            fontWeight="700"
            fontVariantNumeric="tabular-nums"
            color="text"
          >
            SPY 770.19
          </Box>
          <Box as="span" color="accentAlt" fontWeight="600">
            {' '}
            &minus;0.39%
          </Box>{' '}
          — the tired-world tape.
        </EvidenceRow>
      </Box>
    </Box>
  )
}
