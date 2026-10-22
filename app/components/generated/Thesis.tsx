import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { Ground } from '../Material'

const base = css({
  position: 'relative',
  overflow: 'hidden',
  bg: 'field',
  color: 'fieldInk',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  minHeight: { base: '62vh', lg: '70vh' },
  paddingTop: { base: '48px', lg: 'clamp(48px, 6vh, 96px)' },
  paddingBottom: { base: '40px', lg: 'clamp(56px, 8vh, 110px)' },
  paddingInline: { base: '24px', lg: 'clamp(32px, 4vw, 72px)' },
  lg: { alignItems: 'flex-end', textAlign: 'right' },
  _before: {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    top: '20px',
    left: '20px',
    width: '20px',
    height: '20px',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderColor: 'accentAlt',
    borderWidth: '0',
    borderTopWidth: '2px',
    borderLeftWidth: '2px',
  },
  _after: {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    bottom: '20px',
    right: '20px',
    width: '20px',
    height: '20px',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderColor: 'accentAlt',
    borderWidth: '0',
    borderBottomWidth: '2px',
    borderRightWidth: '2px',
  },
})

const pinnedClass = css({
  lg: { position: 'sticky', top: '0', alignSelf: 'start', minHeight: '100vh' },
})

export function ThesisPanel({ children, pinned }: { children: ReactNode; pinned?: boolean }) {
  return (
    <section className={cx(base, pinned && pinnedClass)}>
      <Ground material="grain" seed={742758166} />
      <div className={css({ position: 'relative', zIndex: 1, width: '100%' })}>{children}</div>
    </section>
  )
}
