import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

export function ProjectReferences({ references }: { references: Reference[] }) {
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
        References
      </Box>
      <Box display="flex" flexDirection="column" gap="4">
        {references.map((r) => (
          <Box key={r.url} maxWidth="66ch">
            <a
              href={r.url}
              className={css({
                fontFamily: 'body',
                fontWeight: '600',
                textStyle: 'sm',
                color: 'accent',
              })}
            >
              {r.title}
            </a>
            {r.note && (
              <Box fontFamily="body" textStyle="sm" color="textMuted" marginTop="1">
                {r.note}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
