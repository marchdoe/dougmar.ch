import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Ground } from '../Material'

export function AboutPlane() {
  return (
    <section
      data-beside-margin=""
      className={css({
        gridColumn: { md: '1 / 9', lg: '1 / 10' },
        gridRow: { md: '1' },
        minWidth: '0',
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        paddingTop: 'clamp(20px, 4.5vw, 52px)',
        paddingBottom: 'clamp(22px, 4.5vw, 48px)',
        paddingInline: '5vw',
        minHeight: { base: 'clamp(178px, 28vh, 300px)', md: 'clamp(260px, 34vh, 360px)' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      })}
    >
      <Ground material="halftone" seed={692425309} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <div
          className={css({
            fontSize: '13px',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            marginBottom: 'clamp(10px, 2.4vw, 30px)',
            animationName: 'rise',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '80ms',
          })}
        >
          {identity.name}
        </div>
        <h1
          className={css({
            fontFamily: 'body',
            fontWeight: 'normal',
            textStyle: 'lg',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textAlign: 'left',
            maxWidth: '46ch',
            color: 'fieldInk',
            animationName: 'rise',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
    </section>
  )
}
