import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { Ground } from '../components/Material'

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
          overflow: 'hidden',
          bg: 'bg',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        <Ground material="rule" seed={1908855130} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '48px',
            paddingInline: '72px',
            color: 'text',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
          <h1
            className={css({
              marginTop: 'auto',
              marginBottom: '28px',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'light',
              textTransform: 'lowercase',
              fontSize: '150px',
              lineHeight: '0.92',
              letterSpacing: '-0.025em',
              color: 'text',
              whiteSpace: 'nowrap',
            })}
          >
            commitments
          </h1>
        </div>
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            bg: 'field',
            color: 'fieldInk',
            paddingTop: '32px',
            paddingBottom: '40px',
            paddingInline: '72px',
          })}
        >
          <p
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'light',
              fontSize: '28px',
              lineHeight: '1.3',
              color: 'fieldInk',
            })}
          >
            The quality of your commitments will determine the course of your life.
          </p>
          <span
            className={css({
              display: 'block',
              marginTop: '12px',
              fontFamily: 'body',
              fontSize: 'sm',
              fontWeight: 600,
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wide',
              color: 'fieldInkMuted',
            })}
          >
            Ralph Marston
          </span>
        </div>
      </div>
    </div>
  )
}
