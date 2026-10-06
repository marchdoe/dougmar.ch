import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'

export const Route = createFileRoute('/og')({ component: OgCard })

const coverClass = css({
  position: 'fixed',
  inset: '0',
  zIndex: 9999,
  bg: 'bg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const cardClass = css({
  width: '1200px',
  height: '630px',
  flexShrink: 0,
  bg: 'bg',
  color: 'text',
  fontFamily: 'body',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingTop: '56px',
  paddingBottom: '56px',
  paddingInline: '64px',
})

const lockupClass = css({ display: 'flex', alignItems: 'center', color: 'text' })

const blockClass = css({ display: 'flex', flexDirection: 'column', gap: '20px' })

const monumentClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  lineHeight: '0.86',
  textTransform: 'uppercase',
  textAlign: 'justify',
  color: 'text',
  display: 'flex',
  flexDirection: 'column',
  width: 'fit-content',
})

const l1 = css({ display: 'block', whiteSpace: 'nowrap', fontSize: '64px' })
const l2 = css({ display: 'block', whiteSpace: 'nowrap', fontSize: '100px' })
const l3 = css({ display: 'block', whiteSpace: 'nowrap', fontSize: '130px' })

const attrClass = css({ display: 'flex', flexDirection: 'column', gap: '10px' })
const ruleClass = css({
  width: '260px',
  height: '3px',
  bg: 'accent',
  borderWidth: '0',
  margin: '0',
})
const nameClass = css({
  fontSize: '20px',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})

function OgCard() {
  return (
    <div className={coverClass}>
      <div className={cardClass}>
        <div className={lockupClass}>
          <BrandLockup variant="horizontal-md" mode="original" roleLine />
        </div>
        <div className={blockClass}>
          <h1 className={monumentClass}>
            <span className={l1}>The key to success</span>
            <span className={l2}>Is emotional</span>
            <span className={l3}>Stability</span>
          </h1>
          <div className={attrClass}>
            <hr className={ruleClass} />
            <span className={nameClass}>Warren Buffett</span>
          </div>
        </div>
      </div>
    </div>
  )
}
