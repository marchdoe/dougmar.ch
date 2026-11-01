import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

type Props = { children: ReactNode; edge?: string; tall?: boolean }

export function HeroField({ children, edge, tall }: Props) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        // light scheme keeps the wine drench: field (wine.500) instead of the pale bg
        bg: { base: 'bg', _light: 'field' },
        color: { base: 'text', _light: 'fieldInk' },
        minHeight: tall ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow=""
        className={css({
          position: 'absolute',
          inset: '-4%',
          bg: { base: 'bg', _light: 'field' },
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="mesh" seed={1415931797} />
      </div>
      {edge ? (
        <span
          className={css({
            display: { base: 'none', md: 'block' },
            position: 'absolute',
            left: { md: '4', xl: '5' },
            top: '50%',
            transform: 'translateY(-50%) rotate(180deg)',
            writingMode: 'vertical-rl',
            fontFamily: 'body',
            fontWeight: 'normal',
            fontSize: 'sm',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textMuted',
            bg: 'bg',
            paddingBlock: '3',
            paddingInline: '2',
            borderRadius: 'md',
            zIndex: 2,
          })}
        >
          {edge}
        </span>
      ) : null}
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          flex: '1',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gridTemplateColumns: 'minmax(0, 1fr)',
          paddingTop: { base: '5', md: '6', lg: '7' },
          paddingBottom: { base: '6', lg: '8' },
          paddingInline: { base: '5', md: '7', xl: '8' },
        })}
      >
        {children}
      </div>
    </section>
  )
}
