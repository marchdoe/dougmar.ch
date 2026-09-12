import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Props = { title: string; type: string; year: number }

export function WorkHero({ title, type, year }: Props) {
  return (
    <Box
      as="header"
      className={css({
        bg: 'field',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: { base: '8', lg: '9' },
      })}
    >
      <span
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'fieldInkMuted',
          display: 'block',
          marginBottom: '5',
        })}
      >
        {type} · {year}
      </span>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: '500',
          textStyle: { base: '2xl', lg: 'hero' },
          letterSpacing: 'tight',
          color: 'fieldInk',
          textAlign: { lg: 'right' },
        })}
      >
        {title}
      </h1>
    </Box>
  )
}
