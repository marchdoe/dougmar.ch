import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { personal } from '../content/about'

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
          bg: 'bg',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '64px',
          textAlign: 'center',
          color: 'text',
        })}
      >
        <BrandLockup variant="mark-only-md" mode="original" />
        <span
          className={`tnum ${css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '150px',
            lineHeight: '0.9',
            color: 'fieldBorder',
          })}`}
        >
          {personal.holesInOne}
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: '52px',
            lineHeight: '1.08',
            letterSpacing: '-0.005em',
            textTransform: 'lowercase',
            color: 'text',
            maxWidth: '920px',
          })}
        >
          Four holes in one. The scorecard is the first experiment.
        </h1>
      </div>
    </div>
  )
}
