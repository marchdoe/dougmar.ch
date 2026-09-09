import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

export function ReferencesList({ references }: { references?: Reference[] }) {
  if (!references) return null
  return (
    <Box display="flex" flexDirection="column" gap="2">
      {references.map((r) => (
        <Box key={r.url}>
          <a href={r.url} className={css({ textStyle: 'base', color: 'accent' })}>
            {r.title}
          </a>
          {r.note && <Box className={css({ textStyle: 'sm', color: 'textFaint' })}>{r.note}</Box>}
        </Box>
      ))}
    </Box>
  )
}
