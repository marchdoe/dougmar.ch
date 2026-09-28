import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

function OgCard() {
  return (
    <div
      data-folded-shell=""
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
          boxSizing: 'border-box',
          bg: 'field',
          color: 'fieldInk',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: '72px',
            left: '80px',
            bg: 'surface',
            color: 'text',
            borderRadius: 'sm',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            paddingBlock: '16px',
            paddingInline: '18px',
          })}
        >
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </div>
        <h1
          className={css({
            position: 'absolute',
            left: '80px',
            right: '80px',
            bottom: '72px',
            margin: '0',
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '68px',
            lineHeight: '0.95',
            letterSpacing: '0.01em',
            color: 'fieldInk',
            maxWidth: '1000px',
          })}
        >
          <span
            className={css({
              color: 'transparent',
              WebkitTextStroke: '2px token(colors.fieldInk)',
            })}
          >
            Buildable
          </span>{' '}
          before the first line of code. Faithful after the last.
        </h1>
      </div>
    </div>
  )
}
