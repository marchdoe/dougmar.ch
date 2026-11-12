import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const cover = css({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  bg: 'bgAlt',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const card = css({
  position: 'relative',
  width: '1200px',
  height: '630px',
  flexShrink: 0,
  bg: 'bg',
  color: 'text',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingTop: '64px',
  paddingLeft: '64px',
  paddingRight: '64px',
  paddingBottom: '120px',
})

const phrase = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: '4xl',
  lineHeight: '1.02',
  textTransform: 'uppercase',
  textAlign: 'left',
  color: 'text',
  maxWidth: '1072px',
})

const line = css({ display: 'block' })

/* The mint band from the home ledger, running off the right edge of the card. */
const band = css({
  position: 'absolute',
  left: '64px',
  right: '0px',
  bottom: '0px',
  height: '56px',
  bg: 'field',
})

function OgCard() {
  return (
    <div className={cover}>
      <div className={card}>
        <BrandLockup variant="mark-only-md" mode="original" />
        <h1 className={phrase}>
          <span className={line}>{"Cut what doesn't matter."}</span>
          <span className={line}>{"Ship what's left."}</span>
        </h1>
        <div aria-hidden="true" className={band} />
      </div>
    </div>
  )
}
