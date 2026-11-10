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
        bg: 'surface',
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
          bg: 'surface',
          color: 'text',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderBottomWidth: '8px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '88px',
            lineHeight: '0.98',
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            color: 'text',
          })}
        >
          <span className={css({ display: 'block' })}>twenty-five under.</span>
          <span className={css({ display: 'block', color: 'accentAlt' })}>one shot clear.</span>
        </h1>
      </div>
    </div>
  )
}
