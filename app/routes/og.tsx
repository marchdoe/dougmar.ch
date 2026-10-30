import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { identity } from '../content/about'

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
          bg: 'field',
          color: 'fieldInk',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        })}
      >
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: '18px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'fieldInk',
          })}
        >
          {identity.name} · Spaceman
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontSize: '68px',
            lineHeight: '1.08',
            letterSpacing: 'wide',
            color: 'fieldInk',
            maxWidth: '1000px',
          })}
        >
          Zeldman and Rolex hired one person for both.
        </h1>
        <div className={css({ color: 'fieldInk' })}>
          <BrandLockup variant="mark-only-md" mode="original" />
        </div>
      </div>
    </div>
  )
}
