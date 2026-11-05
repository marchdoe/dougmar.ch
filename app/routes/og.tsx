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
          position: 'relative',
          flexShrink: '0',
          width: '1200px',
          height: '630px',
          bg: 'field',
          color: 'text',
        })}
      >
        <div className={css({ position: 'absolute', top: '48px', right: '56px', color: 'text' })}>
          <BrandLockup variant="stacked-lg" mode="original" />
        </div>
        <h1
          className={css({
            position: 'absolute',
            left: '56px',
            bottom: '48px',
            width: '1088px',
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            textAlign: 'left',
            fontSize: '160px',
            lineHeight: '0.86',
            letterSpacing: '0.01em',
            color: 'text',
          })}
        >
          <span className={css({ display: 'block' })}>
            Ask Why
            <span aria-hidden="true" className={css({ color: 'accent' })}>
              .
            </span>
          </span>{' '}
          <span className={css({ display: 'block', marginLeft: '240px' })}>Then Build</span>{' '}
          <span className={css({ display: 'block', marginLeft: '375px' })}>The Answer.</span>
        </h1>
      </div>
    </div>
  )
}
