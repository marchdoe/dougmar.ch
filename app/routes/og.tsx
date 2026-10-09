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
          flexShrink: 0,
          display: 'grid',
          gridTemplateColumns: '900px 300px',
          bg: 'bg',
        })}
      >
        <div
          className={css({
            bg: 'field',
            color: 'fieldInk',
            paddingBlock: '64px',
            paddingInline: '72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          })}
        >
          <BrandLockup variant="stacked-lg" mode="original" />
          <h1
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'light',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: '74px',
              lineHeight: 'tight',
              color: 'fieldInk',
              maxWidth: '740px',
            })}
          >
            What is easy and what is right
          </h1>
        </div>
        <div
          className={css({
            bg: 'bg',
            borderLeft: '6px solid',
            borderColor: 'accent',
          })}
        />
      </div>
    </div>
  )
}
