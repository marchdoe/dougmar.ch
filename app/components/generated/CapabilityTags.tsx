import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const tagCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textMuted',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'md',
  padding: '2 3',
})

export function CapabilityTags({ items }: { items: string[] }) {
  return (
    <Box as="section" padding={{ base: '24px 20px', md: '32px 7vw' }}>
      <Box className={headCss}>Capabilities</Box>
      <Flex wrap="wrap" gap="2">
        {items.map((c) => (
          <span key={c} className={tagCss}>
            {c}
          </span>
        ))}
      </Flex>
    </Box>
  )
}
