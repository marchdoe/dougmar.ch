import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { OutlinedWord } from './OutlinedWord'

const wipe = (delay: string) =>
  css({
    animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
    animationDelay: delay,
  })

type HeroProps = {
  word: string
  eyebrow: string
  eyebrowHref?: string
  deck: ReactNode
}

export function Hero({ word, eyebrow, eyebrowHref, deck }: HeroProps) {
  const eyebrowClass = css({
    textStyle: '2xs',
    letterSpacing: 'wide',
    textTransform: 'uppercase',
    color: 'textFaint',
    maxWidth: { base: '140px', md: '160px' },
    textAlign: 'right',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  })

  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bgAlt',
        minHeight: { base: 'auto', lg: '62vh' },
        pt: { base: '7', lg: '9' },
        pb: { base: '6', lg: '8' },
      })}
    >
      <Ground material="dots" seed={1959335082} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: { base: '4', lg: '8' },
            mb: { base: '6', lg: '9' },
          })}
        >
          <div className={`${css({ color: 'accent' })} ${wipe('80ms')}`}>
            <BrandLockup variant="mark-only-md" mode="original" />
          </div>
          {eyebrowHref ? (
            <a href={eyebrowHref} className={`${eyebrowClass} ${wipe('160ms')}`}>
              {eyebrow}
            </a>
          ) : (
            <p className={`${eyebrowClass} ${wipe('160ms')}`}>{eyebrow}</p>
          )}
        </div>

        <h1 className={`${css({ px: { base: '2', lg: '3' } })} ${wipe('0ms')}`}>
          <OutlinedWord word={word} />
        </h1>

        <div
          className={`${css({
            bg: 'field',
            color: 'fieldInk',
            px: { base: '4', lg: '8' },
            py: { base: '5', lg: '7' },
            mt: { base: '5', lg: '7' },
            textStyle: 'lg',
            fontWeight: 'normal',
            lineHeight: 'loose',
            maxWidth: { base: '100%', lg: '60ch' },
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
          })} ${wipe('240ms')}`}
        >
          {deck}
        </div>
      </div>
    </header>
  )
}
