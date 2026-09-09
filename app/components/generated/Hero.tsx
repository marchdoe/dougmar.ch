import { Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function Hero() {
  return (
    <Flex
      as="main"
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      flex="1 1 auto"
      gap="4"
      paddingBlock={{ base: '56px', md: '96px', lg: '140px' }}
      paddingInline={{ base: '20px', md: '6', lg: '8' }}
    >
      <p
        className={css({
          textStyle: 'sm',
          fontSize: 'base',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'accentAlt',
          fontWeight: '600',
          margin: 0,
        })}
      >
        A portfolio that rebuilds itself nightly
      </p>
      <h1
        className={css({
          maxWidth: '16ch',
          margin: 0,
          fontWeight: '800',
          fontFamily: 'display',
          textStyle: 'hero',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        Limit the number of details
        <span className={css({ color: 'accent' })}>.</span>
      </h1>
      <p
        className={css({
          maxWidth: '38ch',
          margin: 0,
          textStyle: 'xl',
          fontWeight: '400',
          color: 'textMuted',
        })}
      >
        Every detail asks for attention.{' '}
        <em className={css({ color: 'accentAlt', fontStyle: 'italic' })}>
          Limiting how many we add
        </em>{' '}
        is what gives us room to make the ones that remain better. Tonight&apos;s new moon is 3.3%
        lit — the darkest of the cycle — so the honest gesture is not to add, but to withhold.
      </p>
    </Flex>
  )
}
