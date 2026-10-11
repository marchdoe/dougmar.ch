import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { Ground } from '../components/Material'
import { Lab } from '../components/generated/Lab'

export const Route = createFileRoute('/og')({ component: OgCard })

// The lockup is pinned to the top-right corner and the phrase block is pinned
// to the bottom-left, each 64px inside the card. The phrase grows upward from
// its bottom anchor, so it can never run past the card's lower edge.
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
          bg: 'bg',
          color: 'text',
        })}
      >
        <Ground material="rule" seed={960374345} />
        <div
          className={css({
            position: 'absolute',
            top: '64px',
            right: '64px',
            zIndex: 1,
          })}
        >
          <BrandLockup
            variant="stacked-lg"
            mode="single-color"
            className={css({ color: 'text' })}
          />
        </div>
        <div
          className={css({
            position: 'absolute',
            left: '64px',
            bottom: '64px',
            zIndex: 1,
            width: '740px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: '40px',
              lineHeight: '1',
              letterSpacing: 'tight',
              color: 'accentAlt',
              bg: 'bg',
              paddingTop: '0.1em',
              paddingBottom: '0.14em',
              paddingInlineEnd: '0.12em',
            })}
          >
            Spaceman
          </div>
          <h1
            className={css({
              marginTop: '3',
              marginBottom: '0',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontSize: '40px',
              lineHeight: '1.12',
              letterSpacing: 'tight',
              color: 'text',
            })}
          >
            Better to die fighting for freedom than be a prisoner all the days of your life.
          </h1>
          <div className={css({ marginTop: '3', bg: 'bg' })}>
            <Lab>Bob Marley</Lab>
          </div>
        </div>
      </div>
    </div>
  )
}
