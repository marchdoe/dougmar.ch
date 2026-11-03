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
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: { base: 'accent', _dark: 'field' },
      })}
    >
      <div
        className={css({
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          bg: { base: 'accent', _dark: 'field' },
          color: 'fieldInk',
        })}
      >
        <div>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            textAlign: 'right',
            textTransform: 'lowercase',
            fontVariant: 'small-caps',
            fontWeight: 'normal',
            letterSpacing: '0.01em',
            color: 'fieldInk',
          })}
        >
          <span className={css({ display: 'block', fontSize: '108px', lineHeight: '1' })}>
            Four holes in one.
          </span>
          <span
            className={css({
              display: 'block',
              fontSize: '52px',
              lineHeight: '1.05',
              marginTop: '20px',
            })}
          >
            The scorecard is the first experiment.
          </span>
        </h1>
      </div>
    </div>
  )
}
