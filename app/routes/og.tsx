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
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          bg: 'bg',
          overflow: 'hidden',
          isolation: 'isolate',
          fontFamily: 'display',
        })}
      >
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            left: '-10%',
            right: '-10%',
            top: '29%',
            height: '42%',
            bg: 'field',
            borderBlockWidth: '1px',
            borderBlockStyle: 'solid',
            borderColor: 'fieldBorder',
            transform: 'rotate(-8deg)',
            zIndex: -1,
          })}
        />
        <div
          className={css({
            position: 'absolute',
            top: '56px',
            left: '64px',
            zIndex: 2,
            color: 'text',
          })}
        >
          <BrandLockup variant="horizontal-md" mode="original" />
        </div>
        <div
          className={css({
            position: 'absolute',
            top: '120px',
            bottom: '72px',
            left: '96px',
            right: '96px',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <h1
            className={css({
              fontSize: '80px',
              lineHeight: '1.02',
              letterSpacing: 'tight',
              fontWeight: 'normal',
              textTransform: 'lowercase',
              textAlign: 'center',
              color: 'fieldInk',
              maxWidth: '980px',
            })}
          >
            what ships should look like what was designed
          </h1>
        </div>
      </div>
    </div>
  )
}
