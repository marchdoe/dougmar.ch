import { useRouterState } from '@tanstack/react-router'
import { type ReactNode, useSyncExternalStore } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { FooterStrip } from './generated/FooterStrip'

const subscribeToNothing = () => () => {}

// /work draws its own masthead (#561), so the night's header would stack on
// top of it. Hydration renders it anyway to match the shell (#789).
function useOnWorkIndex() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const hydrating = useSyncExternalStore(
    subscribeToNothing,
    () => false,
    () => true
  )
  return !hydrating && (pathname === '/work' || pathname === '/work/')
}

export function Layout({ children }: { children: ReactNode }) {
  const onWorkIndex = useOnWorkIndex()
  return (
    <div
      className={css({
        bg: 'bg',
        color: 'text',
        fontFamily: 'body',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      })}
    >
      {onWorkIndex ? null : <Sidebar />}
      <main id="top" className={css({ flex: '1', display: 'block' })}>
        {children}
      </main>
      <FooterStrip />
    </div>
  )
}
