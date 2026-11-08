import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

// Mockup ink50 on the ink panel maps to surface. Mockup ink200 and gold200 on the
// grain map to fieldInk, which keeps small type clear of the texture in both schemes.
export function FigurePanel() {
  return (
    <div
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'surface',
        paddingTop: '96px',
        paddingRight: '0',
        paddingBottom: '56px',
        paddingLeft: 'var(--pad)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        textAlign: 'right',
        minWidth: '0',
        minHeight: { base: '72vh', lg: '100vh' },
        order: { base: '0', lg: '2' },
      })}
    >
      <Ground material="grain" seed={1533375130} />
      <div
        aria-hidden="true"
        className={css({
          display: { base: 'none', sm: 'flex' },
          position: 'absolute',
          left: '0',
          top: '0',
          bottom: '0',
          zIndex: 0,
          pointerEvents: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          maxWidth: '40%',
          fontFamily: 'display',
          fontSize: 'clamp(64px,8vw,132px)',
          lineHeight: '0.86',
          color: 'transparent',
          WebkitTextStroke: '1.5px var(--colors-field-ink)',
          opacity: 0.16,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        })}
      >
        <span>−21</span>
        <span>−21</span>
        <span>−21</span>
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          width: '100%',
        })}
      >
        <h1
          className={css({
            display: 'block',
            width: 'clamp(180px,22vw,236px)',
            marginLeft: 'auto',
            textAlign: 'right',
            textWrap: 'wrap',
          })}
        >
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              textTransform: 'uppercase',
              letterSpacing: '0.015em',
              lineHeight: '0.96',
              fontSize: 'clamp(26px,4.4vw,44px)',
              color: 'surface',
              textAlign: 'justify',
              textAlignLast: 'justify',
            })}
          >
            Ben James leads at
          </span>{' '}
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: 'clamp(120px,15vw,160px)',
              lineHeight: '0.82',
              color: 'fieldInk',
              letterSpacing: '0.005em',
              marginTop: '4px',
              textAlign: 'justify',
              textAlignLast: 'justify',
            })}
          >
            − 21
          </span>
        </h1>
        <div
          className={css({
            textStyle: 'xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'fieldInk',
            maxWidth: '30ch',
            marginTop: '22px',
            marginLeft: 'auto',
          })}
        >
          World Wide Technology Championship · El Cardonal, Los Cabos · Round 3, in progress
        </div>
        <span
          className={css({
            marginTop: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            textStyle: 'sm',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'fieldInk',
          })}
        >
          <span
            className={css({ width: '9px', height: '9px', bg: 'fieldInk', borderRadius: 'full' })}
          />
          Live · three back to the field
        </span>
      </div>
    </div>
  )
}
