import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { Ground } from '../components/Material'

export const Route = createFileRoute('/og')({ component: OgCard })

const line = css({ display: 'block', textAlign: 'justify', textAlignLast: 'justify' })
const outline = css({ color: 'transparent', WebkitTextStroke: '1.6px token(colors.accent)' })

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
          flexShrink: '0',
          bg: 'bg',
        })}
      >
        <Ground material="mesh" seed={1010854297} />
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBlock: '64px',
            paddingInline: '72px',
          })}
        >
          <div className={css({ color: 'text', display: 'inline-flex' })}>
            <BrandLockup variant="horizontal-md" mode="single-color" roleLine />
          </div>
          <h1
            className={css({
              width: '880px',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '76px',
              lineHeight: '0.96',
              letterSpacing: '-0.02em',
              color: 'text',
            })}
          >
            <span className={line}>{"You can't go"}</span>
            <span className={line}>
              <span className={outline}>forward</span> and
            </span>
            <span className={line}>
              <span className={outline}>backwards</span> at
            </span>
            <span className={line}>the same time.</span>
          </h1>
        </div>
      </div>
    </div>
  )
}
