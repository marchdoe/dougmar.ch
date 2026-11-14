import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const overlayCls = css({
  position: 'fixed',
  inset: '0',
  zIndex: 9999,
  bg: 'bg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const cardCls = css({
  width: '1200px',
  height: '630px',
  flexShrink: 0,
  bg: 'bg',
  display: 'grid',
  gridTemplateColumns: '380px 1fr',
})

const markCls = css({ padding: '56px', color: 'text' })

// Plate #115e58 maps to surface, the nearest semantic plane.
const plateCls = css({
  bg: 'surface',
  padding: '56px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
})

const phraseCls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  fontSize: '60px',
  lineHeight: 'tight',
  letterSpacing: 'tight',
  textAlign: 'right',
  color: 'text',
  maxWidth: '660px',
})

function OgCard() {
  return (
    <div className={overlayCls}>
      <div className={cardCls}>
        <div className={markCls}>
          <BrandLockup variant="stacked-lg" mode="original" />
        </div>
        <div className={plateCls}>
          <h1 className={phraseCls}>
            Thousands of kids practicing spelling from the list the teacher sent home.
          </h1>
        </div>
      </div>
    </div>
  )
}
