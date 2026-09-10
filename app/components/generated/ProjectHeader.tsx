import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = {
  title: string
  type: string
  year: number
  role?: string
  timeline?: string
  status?: string
}

export function ProjectHeader({ title, type, year, role, timeline, status }: Props) {
  const meta = [type, String(year), role, timeline, status].filter(Boolean).join(' · ')
  return (
    <Box
      className={css({
        bg: 'bg',
        color: 'text',
        paddingX: { base: '5', lg: '6vw' },
        paddingTop: { base: '8', lg: '9' },
        paddingBottom: { base: '6', lg: '7' },
      })}
    >
      <p
        className={css({
          textStyle: '2xs',
          fontWeight: '700',
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        {meta}
      </p>
      <h1
        className={css({
          fontFamily: 'display',
          textStyle: { base: '3xl', lg: 'hero' },
          lineHeight: 'tight',
          color: 'text',
        })}
      >
        {title}
      </h1>
    </Box>
  )
}
