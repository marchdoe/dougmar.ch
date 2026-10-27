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
          bg: 'bg',
          color: 'text',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBlock: '56px',
          paddingInline: '64px',
          boxSizing: 'border-box',
        })}
      >
        <h1
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '2px',
            textAlign: 'right',
            textTransform: 'lowercase',
            fontStyle: 'italic',
            color: 'text',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontSize: '168px',
              lineHeight: '0.86',
              letterSpacing: '-0.02em',
            })}
          >
            Detroit
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontSize: '52px',
              lineHeight: '1.02',
              letterSpacing: '-0.01em',
              maxWidth: '16ch',
              marginTop: '8px',
            })}
          >
            went two for two this weekend
          </span>
        </h1>
        <div
          className={css({
            alignSelf: 'flex-start',
            bg: 'field',
            color: 'fieldInk',
            border: '1px solid',
            borderColor: 'fieldBorder',
            borderRadius: 'sm',
            paddingBlock: '20px',
            paddingInline: '24px',
          })}
        >
          <BrandLockup
            variant="horizontal-md"
            mode={{ light: 'original', dark: 'single-color' }}
            roleLine
          />
        </div>
      </div>
    </div>
  )
}
