import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function SpineHead({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        textStyle: '2xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'accentAlt',
        paddingBottom: '10px',
        marginBottom: '18px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      {children}
    </div>
  )
}

export function CapabilityList() {
  return (
    <>
      <SpineHead>Capabilities</SpineHead>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {capabilities.map((capability) => (
          <li
            key={capability}
            className={css({
              fontSize: '17px',
              fontWeight: '600',
              color: 'text',
              paddingBlock: '12px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              _first: { borderTopWidth: '0' },
            })}
          >
            {capability}
          </li>
        ))}
      </ul>
    </>
  )
}

export function TrajectoryShell({ children, rail }: { children: ReactNode; rail: ReactNode }) {
  return (
    <section
      className={css({
        bg: 'surface',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        alignItems: { md: 'flex-start' },
        gap: { base: '36px', md: '56px', lg: '7vw' },
        paddingTop: { base: '44px', md: '60px', lg: '72px' },
        paddingBottom: { base: '44px', md: '60px', lg: '72px' },
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
      })}
    >
      <div className={css({ flex: { md: '1 1 0' }, minWidth: '0' })}>
        <SpineHead>Trajectory</SpineHead>
        {children}
      </div>
      <div
        className={css({
          flex: { md: '0 0 34%', lg: '0 0 28%' },
          minWidth: { md: '200px', lg: '220px' },
        })}
      >
        {rail}
      </div>
    </section>
  )
}
