import { Box } from '../../../styled-system/jsx'

type Entry = { year: string; role: string; company: string; description: string; current?: boolean }

export function TimelineList({ entries }: { entries: Entry[] }) {
  return (
    <Box
      as="section"
      bg="bg"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingBlock={{ base: '9', lg: '9' }}
    >
      <Box
        as="p"
        fontFamily="body"
        textStyle="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        color="textFaint"
        marginBottom={{ base: '6', lg: '7' }}
      >
        Timeline
      </Box>
      {entries.map((entry) => (
        <Box
          key={`${entry.year}-${entry.company}`}
          display="flex"
          gap="6"
          borderTop="1px solid"
          borderColor="border"
          paddingY="5"
          flexWrap="wrap"
        >
          <Box
            flex="0 0 120px"
            minWidth="120px"
            fontFamily="body"
            textStyle="sm"
            color={entry.current ? 'accent' : 'textFaint'}
            fontVariantCaps="all-small-caps"
          >
            {entry.year}
          </Box>
          <Box flex="1 1 300px" maxWidth="40ch">
            <Box fontFamily="body" fontWeight="600" textStyle="sm" color="text">
              {entry.role} — {entry.company}
            </Box>
            <Box fontFamily="body" textStyle="sm" color="textMuted" marginTop="1" lineHeight="1.45">
              {entry.description}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
