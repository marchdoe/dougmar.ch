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
        bg: 'field',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          fontFamily: 'body',
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'fieldInk',
          })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
          <span
            className={css({
              textStyle: 'sm',
              color: 'fieldInkMuted',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              fontWeight: 'bold',
            })}
          >
            doug march, selected work
          </span>
        </div>
        <h1
          className={css({
            alignSelf: 'flex-end',
            textAlign: 'right',
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'lowercase',
            fontSize: '92px',
            lineHeight: '1.04',
            letterSpacing: '-0.01em',
            maxWidth: '15ch',
            color: 'fieldInk',
          })}
        >
          I build the things I want to exist.
        </h1>
      </div>
    </div>
  )
}
