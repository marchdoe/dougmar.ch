import { Box, Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Signal = { label: string; value: string; live?: boolean }
type Quote = { text: string; who: string }

type Props = { quote?: Quote; signals: Signal[]; rotation?: string }

export function Colophon({ quote, signals, rotation }: Props) {
  return (
    <Box
      as="footer"
      borderTop="1px solid"
      borderColor="borderStrong"
      paddingBlock={{ base: '6', md: '7' }}
      paddingInline={{ base: '20px', md: '6', lg: '8' }}
      display="flex"
      flexDirection="column"
      gap="3"
    >
      {quote && (
        <p
          className={css({
            textStyle: 'sm',
            color: 'textFaint',
            fontStyle: 'italic',
            maxWidth: '52ch',
            margin: 0,
          })}
        >
          {quote.text}
          <span
            className={css({
              fontStyle: 'normal',
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wide',
              color: 'textMuted',
              marginLeft: '2',
            })}
          >
            {quote.who}
          </span>
        </p>
      )}
      <Flex
        wrap="wrap"
        gap={{ base: '3', md: '4' }}
        className={css({
          textStyle: '2xs',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        {signals.map((s) => (
          <span key={s.label}>
            {s.label}{' '}
            <b className={css({ fontWeight: '400', color: s.live ? 'accent' : 'textMuted' })}>
              {s.value}
            </b>
          </span>
        ))}
      </Flex>
      {rotation && (
        <p
          className={css({
            textStyle: '2xs',
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            color: 'textFaint',
            margin: 0,
          })}
        >
          On rotation — <b className={css({ fontWeight: '400', color: 'textMuted' })}>{rotation}</b>
        </p>
      )}
    </Box>
  )
}
