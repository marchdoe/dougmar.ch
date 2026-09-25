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
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      })}
    >
      <div
        className={css({
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          overflow: 'hidden',
          bg: 'bg',
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingInline: '8',
        })}
      >
        <span
          aria-hidden="true"
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-4deg)',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: '520px',
            lineHeight: '1',
            color: 'text',
            opacity: 0.055,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          })}
        >
          fun
        </span>
        <div
          className={css({
            position: 'absolute',
            top: '48px',
            left: '56px',
            color: 'text',
            zIndex: '1',
          })}
        >
          <BrandLockup variant="horizontal-md" mode="single-color" />
        </div>
        <h1
          className={css({
            position: 'relative',
            zIndex: '1',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontSize: '76px',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'text',
            maxWidth: '18ch',
          })}
        >
          People rarely succeed unless they have fun in what they are doing.
        </h1>
        <p
          className={css({
            position: 'relative',
            zIndex: '1',
            marginTop: '5',
            fontFamily: 'body',
            fontSize: '20px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
          })}
        >
          Dale Carnegie
        </p>
      </div>
    </div>
  )
}
