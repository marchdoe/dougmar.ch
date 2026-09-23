import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { Ground } from '../components/Material'
import { identity } from '../content/about'

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
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: 0,
          overflow: 'hidden',
          bg: 'field',
          color: 'fieldInk',
          borderTopWidth: '6px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        <Ground material="halftone" seed={1925632749} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingInline: '80px',
            paddingBlock: '64px',
          })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
          <div>
            <div
              className={css({
                fontFamily: 'body',
                fontSize: 'base',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                fontWeight: 'bold',
                marginBottom: '3',
              })}
            >
              {identity.name}
            </div>
            <h1
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '88px',
                lineHeight: '0.9',
                letterSpacing: '0.01em',
                color: 'fieldInk',
              })}
            >
              <span className={css({ display: 'block' })}>Deep in both.</span>
              <span className={css({ display: 'block' })}>Not a generalist.</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
