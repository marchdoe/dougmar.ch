import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const word = css({ display: 'block', color: 'fieldInk' })

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
          flex: 'none',
          bg: 'field',
          color: 'fieldInk',
          padding: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <div className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontStyle: 'italic',
            fontVariant: 'small-caps',
            fontSize: '64px',
            lineHeight: '0.98',
            letterSpacing: '0.01em',
            textAlign: 'left',
            margin: '0',
          })}
        >
          <span className={word}>Every</span>
          <span className={word}>project</span>
          <span className={word}>started</span>
          <span className={word}>as&nbsp;an</span>
          <span className={css({ display: 'block', color: 'accentAlt' })}>experiment.</span>
        </h1>
      </div>
    </div>
  )
}
