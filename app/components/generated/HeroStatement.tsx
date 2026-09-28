import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Scale = 'home' | 'about' | 'work'

const wordClass = {
  home: css({
    display: 'block',
    fontFamily: 'display',
    fontWeight: 'bold',
    textStyle: '5xl',
    fontSize: { lg: 'clamp(110px, 11vw, 156px)' },
    lineHeight: '0.86',
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    color: 'transparent',
    WebkitTextStroke: { base: '2px token(colors.fieldInk)', lg: '2.5px token(colors.fieldInk)' },
  }),
  about: css({
    display: 'block',
    fontFamily: 'display',
    fontWeight: 'bold',
    textStyle: { base: '3xl', lg: '4xl' },
    lineHeight: '0.86',
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    color: 'transparent',
    WebkitTextStroke: '2px token(colors.fieldInk)',
  }),
  work: css({
    display: 'block',
    fontFamily: 'display',
    fontWeight: 'bold',
    textStyle: { base: '3xl', lg: '4xl' },
    fontSize: { lg: 'clamp(80px, 8vw, 120px)' },
    lineHeight: '0.86',
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    color: 'transparent',
    WebkitTextStroke: { base: '2px token(colors.fieldInk)', lg: '2.5px token(colors.fieldInk)' },
  }),
}

// Decks sit on a flat field block so the ruled ground never runs through their baselines.
const deckClass = {
  home: css({
    display: 'block',
    marginTop: '20px',
    fontFamily: 'body',
    fontWeight: 'normal',
    textStyle: { base: 'lede', lg: 'xl' },
    lineHeight: '1.4',
    color: 'fieldInk',
    bg: 'field',
    width: 'fit-content',
    maxWidth: '22ch',
    animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
    animationDelay: '160ms',
    '& b': { fontWeight: 'bold', color: 'fieldInkMuted' },
  }),
  about: css({
    display: 'block',
    marginTop: '20px',
    fontFamily: 'body',
    fontWeight: 'normal',
    textStyle: 'lede',
    lineHeight: '1.45',
    color: 'fieldInk',
    bg: 'field',
    width: 'fit-content',
    maxWidth: '40ch',
    animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
    animationDelay: '160ms',
  }),
  work: css({
    display: 'block',
    marginTop: '20px',
    fontFamily: 'body',
    textStyle: 'lede',
    color: 'fieldInk',
    bg: 'field',
    width: 'fit-content',
    maxWidth: '40ch',
    animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
    animationDelay: '160ms',
  }),
}

type Props = { scale: Scale; eyebrow: string; word: string; deck?: ReactNode; children?: ReactNode }

export function HeroStatement({ scale, eyebrow, word, deck, children }: Props) {
  return (
    <div>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'fieldInkMuted',
          marginBottom: '12px',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {eyebrow}
      </div>
      <h1
        className={css({
          margin: '0',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span className={wordClass[scale]}>{word}</span>
        {deck ? <span className={deckClass[scale]}>{deck}</span> : null}
      </h1>
      {children ? (
        <div
          className={css({
            marginTop: '5',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
