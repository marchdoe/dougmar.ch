import { css } from '../../styled-system/css'
import { Box, Flex } from '../../styled-system/jsx'
import { BrandLockup } from './BrandLockup'
import { identity } from '../content/about'

const signals: { label: string; value: string; win?: boolean }[] = [
  { label: 'score', value: 'DET 6–2 · W vs CLE', win: true },
  { label: 'market', value: 'SPY 764.29 ▲0.85%', win: true },
  { label: 'moon', value: 'New · 1.8% illum' },
  { label: 'weather', value: 'Overcast 67°F · Aldie, VA' },
  { label: 'air', value: 'AQI — Good' },
  { label: 'now playing', value: 'Guided by Voices · Tobin Sprout · The War on Drugs' },
]

export function Sidebar() {
  return (
    <Box
      as="footer"
      className={css({
        bg: 'bgAlt',
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        paddingInline: { base: '5', lg: '9' },
        paddingBottom: { base: '8', lg: '9' },
      })}
    >
      <Flex
        wrap="wrap"
        align="center"
        justify="space-between"
        gap="5"
        className={css({
          minHeight: '96px',
          paddingBlock: '6',
          borderBottom: '1px solid',
          borderColor: 'border',
        })}
      >
        <a
          href="/"
          aria-label="Doug March — home"
          className={css({ display: 'flex', alignItems: 'center', gap: '3', color: 'text' })}
        >
          <BrandLockup variant="horizontal-md" mode="single-color" />
        </a>
        <nav aria-label="Primary" className={css({ display: 'flex', gap: '6' })}>
          <a
            href="/"
            className={css({
              textStyle: 'xs',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              color: 'textMuted',
              fontVariant: 'small-caps',
              paddingBlock: '3',
            })}
          >
            work
          </a>
          <a
            href="/about"
            className={css({
              textStyle: 'xs',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              color: 'textMuted',
              fontVariant: 'small-caps',
              paddingBlock: '3',
            })}
          >
            about
          </a>
          <a
            href={`mailto:${identity.email}`}
            className={css({
              textStyle: 'xs',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              color: 'textMuted',
              fontVariant: 'small-caps',
              paddingBlock: '3',
            })}
          >
            contact
          </a>
        </nav>
      </Flex>

      <Box
        className={css({
          borderTop: '1px solid',
          borderColor: 'border',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
          columnGap: { md: '9' },
        })}
      >
        {signals.map((s) => (
          <Flex
            key={s.label}
            justify="space-between"
            align="baseline"
            gap="4"
            className={css({ paddingBlock: '4', borderBottom: '1px solid', borderColor: 'border' })}
          >
            <span
              className={css({
                textStyle: 'xs',
                textTransform: 'lowercase',
                letterSpacing: 'wide',
                color: 'textFaint',
                fontVariant: 'small-caps',
              })}
            >
              {s.label}
            </span>
            <span
              className={css({
                textStyle: 'sm',
                color: s.win ? 'accent' : 'textMuted',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: 'normal',
              })}
            >
              {s.value}
            </span>
          </Flex>
        ))}
      </Box>
    </Box>
  )
}
