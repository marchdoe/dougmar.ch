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
          flex: '0 0 auto',
          bg: 'bg',
          color: 'text',
          paddingBlock: '64px',
          paddingInline: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTopWidth: '6px',
          borderTopStyle: 'solid',
          borderTopColor: 'accent',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '60px',
            lineHeight: '1.08',
            letterSpacing: '-0.01em',
            color: 'text',
            maxWidth: '1060px',
          })}
        >
          Closing the gap between what gets designed and what gets built.
        </h1>
      </div>
    </div>
  )
}
