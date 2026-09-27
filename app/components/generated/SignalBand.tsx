import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

type Cell = { k: string; n: string; s: string }

export function SignalBand({
  head,
  aside,
  cells,
  children,
}: {
  head: string
  aside: string
  cells: Cell[]
  children?: ReactNode
}) {
  return (
    <section
      aria-label={head}
      className={css({
        gridColumn: { lg: '1 / -1' },
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: { base: '36px', lg: '7' },
        paddingInline: { base: '3', lg: '6vw' },
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        borderTopWidth: { base: '0', lg: '1px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {/* mockup --fieldLabel (amber.900) has no token; nearest semantic is fieldInkMuted */}
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2',
          paddingBottom: '12px',
          marginBottom: '20px',
          fontFamily: 'display',
          fontSize: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <span>{head}</span>
        <span>{aside}</span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: '1px',
          bg: 'fieldBorder',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          borderRadius: 'lg',
          overflow: 'hidden',
        })}
      >
        {cells.map((cell) => (
          <div
            key={cell.k}
            className={css({
              bg: 'field',
              paddingBlock: '18px',
              paddingInline: '3',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            <div
              className={css({
                fontFamily: 'display',
                fontSize: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              {cell.k}
            </div>
            <div
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                color: 'fieldInk',
                fontSize: 'clamp(30px, 8vw, 56px)',
                lineHeight: '1',
                marginTop: '2',
              })}
            >
              {cell.n}
            </div>
            <div
              className={css({
                fontFamily: 'display',
                fontSize: '2xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                marginTop: '2',
              })}
            >
              {cell.s}
            </div>
          </div>
        ))}
        {children}
      </div>
    </section>
  )
}
