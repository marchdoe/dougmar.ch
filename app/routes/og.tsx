import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const WORDS = ['Nobody', 'guarded', 'anybody,']

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
      })}
    >
      <div
        className={css({
          width: '1200px',
          height: '630px',
          bg: 'bg',
          color: 'text',
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          flexShrink: '0',
        })}
      >
        <div
          className={css({
            padding: '56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: '0',
          })}
        >
          <div className={css({ color: 'text' })}>
            <BrandLockup variant="horizontal-md" mode="original" roleLine />
          </div>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontVariant: 'small-caps',
              fontSize: '84px',
              lineHeight: '1.02',
              letterSpacing: '0.005em',
              color: 'text',
            })}
          >
            {WORDS.map((w) => (
              <span key={w} className={css({ display: 'block' })}>
                {w}{' '}
              </span>
            ))}
            <span className={css({ display: 'block', color: 'accent' })}>144-140.</span>
          </h1>
        </div>
        <div
          className={css({
            bg: 'field',
            color: 'fieldInk',
            padding: '56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '4',
          })}
        >
          <span
            className={css({
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'fieldInk',
            })}
          >
            Pistons · W
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '120px',
              lineHeight: '0.82',
              color: 'fieldInk',
            })}
          >
            144
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '120px',
              lineHeight: '0.82',
              color: 'fieldInk',
            })}
          >
            140
          </span>
        </div>
      </div>
    </div>
  )
}
