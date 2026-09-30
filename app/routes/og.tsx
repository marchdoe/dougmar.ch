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
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          boxSizing: 'border-box',
          bg: 'field',
          color: 'fieldInk',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '7',
        })}
      >
        <div className={css({ display: 'flex', color: 'fieldInk' })}>
          <BrandLockup variant="stacked-lg" mode="single-color" />
        </div>
        <h1
          className={css({
            alignSelf: 'flex-end',
            textAlign: 'right',
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: '3xl',
            // Fixed for the 1200x630 capture: three lines inside the safe margin.
            fontSize: '64px',
            lineHeight: '1.05',
            maxWidth: '1000px',
            color: 'fieldInk',
          })}
        >
          Design and engineering as one job, not two teams passing files.
        </h1>
      </div>
    </div>
  )
}
