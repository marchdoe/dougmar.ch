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
          bg: 'field',
          color: 'fieldInk',
          paddingBlock: '64px',
          paddingInline: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderBottomWidth: '12px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
        })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '116px',
            lineHeight: '0.95',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'fieldInk',
            textAlign: 'left',
          })}
        >
          <span className={css({ display: 'block' })}>Deep in both.</span>
          <span className={css({ display: 'block', color: 'fieldInkMuted' })}>
            Not a generalist.
          </span>
        </h1>
      </div>
    </div>
  )
}
