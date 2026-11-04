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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'field',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          flexShrink: '0',
          paddingBlock: '64px',
          paddingInline: '64px',
          bg: 'field',
          color: 'fieldInk',
        })}
      >
        <BrandLockup variant="horizontal-md" mode="original" roleLine />
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: '72px',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            textAlign: 'left',
            color: 'fieldInk',
            maxWidth: '1000px',
          })}
        >
          The week's spelling words in. A week of practice out.
        </h1>
      </div>
    </div>
  )
}
