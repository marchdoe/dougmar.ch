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
        boxSizing: 'border-box',
        bg: 'bg',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div
        className={css({
          position: 'relative',
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          bg: 'bg',
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingInline: '80px',
          paddingBlock: '80px',
        })}
      >
        <div className={css({ position: 'absolute', top: '64px', right: '72px', color: 'accent' })}>
          <BrandLockup variant="mark-only-md" mode="single-color" color="accent" />
        </div>
        <div
          className={css({
            fontFamily: 'display',
            fontSize: 'sm',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'accent',
            marginBottom: '4',
          })}
        >
          Sunday · 27 Sep 2026 · Ashburn VA
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '50px',
            lineHeight: '1.16',
            letterSpacing: '0',
            color: 'text',
          })}
        >
          <span className={css({ display: 'block' })}>No one ever said life was fair.</span>
          <span className={css({ display: 'block' })}>Just Eventful.</span>
        </h1>
        <div
          className={css({
            marginTop: '4',
            fontFamily: 'display',
            fontSize: 'base',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'accent',
          })}
        >
          Carol Burnett
        </div>
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            left: '0',
            right: '0',
            bottom: '0',
            height: '24px',
            bg: 'field',
          })}
        />
      </div>
    </div>
  )
}
