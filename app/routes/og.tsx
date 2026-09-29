import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { identity } from '../content/about'

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
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'body',
        })}
      >
        <div className={css({ position: 'absolute', top: '56px', left: '64px' })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
        <div
          className={css({
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: '120px',
            paddingBottom: '40px',
            paddingInline: '120px',
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontSize: '58px',
              lineHeight: '1.16',
              fontWeight: 'normal',
              textTransform: 'lowercase',
              textAlign: 'center',
              maxWidth: '900px',
              color: 'text',
            })}
          >
            What do we live for, if it is not to make life less difficult for each other?
          </h1>
          <p
            className={css({
              marginTop: '4',
              fontSize: '18px',
              letterSpacing: 'wide',
              textTransform: 'lowercase',
              color: 'textMuted',
            })}
          >
            George Eliot
          </p>
        </div>
        <div
          className={css({
            height: '120px',
            bg: 'field',
            color: 'fieldInk',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          })}
        >
          {identity.name}
        </div>
      </div>
    </div>
  )
}
