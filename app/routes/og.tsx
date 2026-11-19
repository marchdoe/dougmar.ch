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
        bg: 'field',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'field',
          color: 'fieldInk',
          borderBottom: '6px solid',
          borderColor: 'accent',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: '72px',
            left: '80px',
            color: 'fieldInk',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
        </div>
        <h1
          className={css({
            position: 'absolute',
            left: '80px',
            right: '80px',
            bottom: '80px',
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '76px',
            lineHeight: '0.98',
            letterSpacing: '0.01em',
            color: 'fieldInk',
            maxWidth: '960px',
          })}
        >
          Design and build on the same desk.
        </h1>
      </div>
    </div>
  )
}
