import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { Fold } from './Fold'

const boardClass = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '0',
  bg: 'field',
  color: 'fieldInk',
  gridArea: { lg: 'board' },
  paddingTop: { base: '20px', md: '36px', lg: '28px' },
  paddingBottom: { base: '36px', md: '56px' },
  paddingInline: { base: '16px', md: '40px', lg: '5vw' },
  borderRightWidth: { lg: '3px' },
  borderRightStyle: { lg: 'solid' },
  borderRightColor: { lg: 'borderStrong' },
})

const tallBoardClass = css({ minHeight: { lg: '92vh' } })

const flowInnerClass = css({ display: 'flex', flexDirection: 'column', flex: '1' })

const pinnedInnerClass = css({
  display: 'flex',
  flexDirection: 'column',
  position: { lg: 'sticky' },
  top: { lg: '28px' },
})

export function Board({ pinned = false, children }: { pinned?: boolean; children: ReactNode }) {
  return (
    <div className={cx(boardClass, pinned ? undefined : tallBoardClass)}>
      <div className={pinned ? pinnedInnerClass : flowInnerClass}>
        <Fold />
        <article className={css({ display: 'flex', flexDirection: 'column', marginTop: 'auto' })}>
          {children}
        </article>
      </div>
    </div>
  )
}

export function BoardKicker({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        fontFamily: 'display',
        textStyle: '2xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'fieldInkMuted',
        marginBottom: '14px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      {children}
    </div>
  )
}

export function BoardTitle({ children }: { children: ReactNode }) {
  return (
    <h2
      className={css({
        fontFamily: 'display',
        fontWeight: 'normal',
        fontSize: 'clamp(52px, 8vw, 120px)',
        lineHeight: '0.92',
        letterSpacing: '-0.03em',
        textTransform: 'lowercase',
        whiteSpace: 'nowrap',
        color: 'fieldInk',
        marginBottom: '18px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      {children}
    </h2>
  )
}

export function BoardCaption({ children }: { children: ReactNode }) {
  return (
    <h1
      className={css({
        fontFamily: 'display',
        fontStyle: 'italic',
        fontWeight: 'normal',
        fontSize: 'clamp(26px, 3.6vw, 44px)',
        lineHeight: '1.2',
        letterSpacing: '-0.01em',
        textTransform: 'lowercase',
        textAlign: 'left',
        color: 'fieldInk',
        maxWidth: '24ch',
        marginBottom: '20px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '0ms',
      })}
    >
      {children}
    </h1>
  )
}

export function BoardHeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1
      className={css({
        fontFamily: 'display',
        fontWeight: 'normal',
        fontSize: 'clamp(44px, 7.5vw, 120px)',
        lineHeight: '0.92',
        letterSpacing: '-0.03em',
        textTransform: 'lowercase',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        color: 'fieldInk',
        marginBottom: '18px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '0ms',
      })}
    >
      {children}
    </h1>
  )
}

export function BoardStandfirst({ children }: { children: ReactNode }) {
  return (
    <p
      className={css({
        fontFamily: 'body',
        fontSize: 'clamp(17px, 1.35vw, 20px)',
        lineHeight: '1.5',
        color: 'fieldInkMuted',
        maxWidth: '52ch',
        marginBottom: '26px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      {children}
    </p>
  )
}
