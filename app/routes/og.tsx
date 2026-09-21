import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: 0,
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
          bg: 'field',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '9',
        })}
      >
        <div className={css({ display: 'flex', alignItems: 'center', color: 'fieldInk' })}>
          <BrandLockup variant="horizontal-md" mode="single-color" roleLine={false} />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'hero',
            lineHeight: 'tight',
            letterSpacing: 'tight',
            color: 'fieldInk',
          })}
        >
          Twenty-six under wins the Biltmore.
        </h1>
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'sm',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
          })}
        >
          Doug March, design and engineering.
        </span>
      </div>
    </div>
  )
}
