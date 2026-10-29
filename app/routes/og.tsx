import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const cy = css({ color: 'accent' })

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
          boxSizing: 'border-box',
          bg: 'bg',
          color: 'text',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <div className={css({ color: 'text' })}>
          <BrandLockup variant="stacked-md" mode="original" />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '66px',
            lineHeight: '1',
            letterSpacing: '-0.01em',
            color: 'text',
            maxWidth: '1000px',
          })}
        >
          <span className={css({ display: 'block' })}>
            Buildable <span className={cy}>before</span> the first line of code.
          </span>
          <span className={css({ display: 'block', marginTop: '3' })}>
            Faithful <span className={cy}>after</span> the last.
          </span>
        </h1>
      </div>
    </div>
  )
}
