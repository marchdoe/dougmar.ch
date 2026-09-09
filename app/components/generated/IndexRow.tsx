import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = {
  year: string
  title: string
  subtitle?: string
  description?: string
  href?: string
  hrefLabel?: string
  tall?: boolean
}

export function IndexRow({ year, title, subtitle, description, href, hrefLabel, tall }: Props) {
  return (
    <Flex
      borderBottom="1px solid"
      borderColor="border"
      paddingBlock={tall ? '5' : '3'}
      gap={{ base: '3', md: '5' }}
      align="baseline"
      wrap="wrap"
      className={css({ _hover: { borderColor: 'accent' } })}
    >
      <Box
        flexShrink={0}
        minWidth={{ base: '80px', md: '120px' }}
        className={css({ textStyle: 'sm', color: 'textFaint', fontVariantNumeric: 'tabular-nums' })}
      >
        {year}
      </Box>
      <Box flex="1 1 240px">
        <Box className={css({ textStyle: tall ? 'lg' : 'base', color: 'text', fontWeight: '600' })}>
          {title}
          {subtitle && (
            <span className={css({ color: 'textMuted', fontWeight: '400' })}> · {subtitle}</span>
          )}
        </Box>
        {description && (
          <Box className={css({ textStyle: 'sm', color: 'textMuted', marginTop: '1' })}>
            {description}
          </Box>
        )}
      </Box>
      {href && (
        <a
          href={href}
          className={css({
            textStyle: 'sm',
            color: 'accentAlt',
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            paddingY: '2',
            paddingX: '2',
          })}
        >
          {hrefLabel ?? 'view →'}
        </a>
      )}
    </Flex>
  )
}
