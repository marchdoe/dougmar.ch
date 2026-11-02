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
          position: 'relative',
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          bg: 'bg',
          color: 'text',
          padding: '64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
        })}
      >
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          })}
        >
          <span className={css({ color: 'text' })}>
            <BrandLockup variant="stacked-md" mode="original" />
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '120px',
              lineHeight: '0.9',
              color: 'accent',
              whiteSpace: 'nowrap',
            })}
          >
            19–15
          </span>
        </div>
        <div>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '20px',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'textMuted',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              _before: {
                content: '""',
                width: '28px',
                height: '4px',
                bg: 'accent',
                display: 'inline-block',
              },
            })}
          >
            Lions · Final
          </div>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '100px',
              lineHeight: '1',
              color: 'text',
              maxWidth: '1000px',
            })}
          >
            Lions win ugly, and I’ll take it.
          </h1>
        </div>
      </div>
    </div>
  )
}
