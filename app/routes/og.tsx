import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { Ground } from '../components/Material'

export const Route = createFileRoute('/og')({ component: OgCard })

const coverCss = css({
  position: 'fixed',
  inset: '0',
  zIndex: 9999,
  bg: 'bg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const cardCss = css({
  position: 'relative',
  width: '1200px',
  height: '630px',
  flexShrink: 0,
  bg: 'bg',
  color: 'text',
})

const contentCss = css({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  height: '100%',
  padding: '64px',
  display: 'flex',
  flexDirection: 'column',
})

const lockupCss = css({
  display: 'inline-flex',
  alignSelf: 'flex-start',
  bg: 'bg',
  color: 'text',
  paddingBlock: '2',
  paddingInline: '3',
  borderRadius: 'sm',
})

const stageCss = css({
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const h1Css = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textAlign: 'center',
  fontSize: '64px',
  lineHeight: '1.04',
  color: 'text',
  maxWidth: '960px',
})

const litCss = css({ color: 'accentAlt' })

function OgCard() {
  return (
    <div className={coverCss}>
      <div className={cardCss}>
        <Ground material="mesh" seed={993929583} />
        <div className={contentCss}>
          <div className={lockupCss}>
            <BrandLockup variant="stacked-md" mode="single-color" />
          </div>
          <div className={stageCss}>
            <h1 className={h1Css}>
              It is not as important how we start, but how we{' '}
              <span className={litCss}>finish.</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
