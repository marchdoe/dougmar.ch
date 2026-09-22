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
          width: '1200px',
          height: '630px',
          position: 'relative',
          bg: 'field',
          color: 'fieldInk',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingInline: '64px',
          paddingBlock: '56px',
        })}
      >
        <div className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="stacked-md" mode="single-color" roleLine />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            lineHeight: '1',
            letterSpacing: 'tight',
            color: 'fieldInk',
            fontSize: 'hero',
            maxWidth: '18ch',
            textAlign: 'right',
            alignSelf: 'flex-end',
          })}
        >
          Buildable before the first line of code.
        </h1>
      </div>
    </div>
  )
}
