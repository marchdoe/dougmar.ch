import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: '0',
        zIndex: 9999,
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'bg',
          color: 'text',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            maxWidth: '1056px',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontSize: '76px',
              lineHeight: '0.92',
              color: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '2.5px currentColor',
            })}
          >
            Ten years independent.
          </span>
          <span
            className={css({
              display: 'block',
              marginTop: '16px',
              fontSize: '36px',
              lineHeight: '1.1',
              color: 'accent',
              maxWidth: '26ch',
            })}
          >
            Still the vehicle for the next experiment.
          </span>
        </h1>
      </div>
    </div>
  )
}
