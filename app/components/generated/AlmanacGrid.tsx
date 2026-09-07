import type { ReactNode } from 'react'
import { Box } from '../../../styled-system/jsx'

export type AlmanacRow = { k: string; v: ReactNode; id?: string }

export function AlmanacGrid({ rows }: { rows: AlmanacRow[] }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: 'repeat(2, minmax(0,1fr))',
        lg: 'repeat(4, minmax(0,1fr))',
      }}
      gap={{ base: '6', lg: '7' }}
      columnGap={{ base: '6', lg: '9' }}
    >
      {rows.map((row) => (
        <Box key={row.k} id={row.id} display="flex" flexDirection="column" gap="1" maxWidth="40ch">
          <Box
            as="span"
            fontFamily="body"
            textStyle="xs"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="wide"
            color="textFaint"
          >
            {row.k}
          </Box>
          <Box fontFamily="body" textStyle="sm" color="textMuted" lineHeight="1.45">
            {row.v}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
