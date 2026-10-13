import { css } from '../../../styled-system/css'

const wrapCss = css({
  position: 'relative',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4',
  textAlign: 'center',
  marginInline: 'auto',
  maxWidth: '100%',
  minHeight: { base: 'calc(100dvh - 180px)', lg: 'auto' },
})

// Mockup sets the hero at clamp(38px, 6vw, 86px); held on a flat bg ground so it
// clears contrast over the drifting mesh.
const h1Css = css({
  boxSizing: 'border-box',
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textAlign: 'center',
  fontSize: { base: '38px', lg: 'clamp(38px, 6vw, 86px)' },
  lineHeight: 'tight',
  letterSpacing: 'normal',
  color: 'text',
  bg: 'bg',
  paddingBlock: '3',
  paddingInline: '4',
  borderRadius: 'sm',
  maxWidth: { base: '100%', lg: '13ch' },
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const litCss = css({ color: 'accentAlt' })

const attributionCss = css({
  fontFamily: 'body',
  fontWeight: 'normal',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textMuted',
  bg: 'bg',
  paddingBlock: '1',
  paddingInline: '3',
  borderRadius: 'sm',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

export function HomeStatement() {
  return (
    <div className={wrapCss}>
      <h1 className={h1Css}>
        It is not as important how we start, but how we <span className={litCss}>finish.</span>
      </h1>
      <p className={attributionCss}>Joyce Meyer</p>
    </div>
  )
}
