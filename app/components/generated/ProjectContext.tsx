import { Box } from '../../../styled-system/jsx'

type Props = { context?: string; constraints?: string[] }

export function ProjectContext({ context, constraints }: Props) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingBlock={{ base: '8', lg: '9' }}
      display="flex"
      flexDirection="column"
      gap="6"
    >
      {context && (
        <Box maxWidth="66ch">
          <Box
            fontFamily="body"
            textStyle="xs"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wide"
            color="textFaint"
            marginBottom="2"
          >
            Context
          </Box>
          <Box fontFamily="body" textStyle="base" color="textMuted" lineHeight="1.55">
            {context}
          </Box>
        </Box>
      )}
      {constraints && constraints.length > 0 && (
        <Box maxWidth="66ch">
          <Box
            fontFamily="body"
            textStyle="xs"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wide"
            color="textFaint"
            marginBottom="2"
          >
            Constraints
          </Box>
          <Box as="ul" margin="0" paddingLeft="5" display="flex" flexDirection="column" gap="2">
            {constraints.map((c) => (
              <Box
                as="li"
                key={c}
                fontFamily="body"
                textStyle="base"
                color="textMuted"
                lineHeight="1.55"
              >
                {c}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
